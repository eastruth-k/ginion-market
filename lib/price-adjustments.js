import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb.js";
import {
  calculatePriceEvaluation,
  PRICE_EVALUATION_INTERVAL_MS,
} from "./price-adjustment-policy.js";

export async function adjustDueProductPrices({
  database,
  now = new Date(),
  force = false,
}) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError("가격 평가 시각이 올바른 Date여야 합니다.");
  }

  const products = database.collection("products");
  const watchlists = database.collection("watchlists");
  const priceChanges = database.collection("priceChange");
  const sellingProducts = await products.find({ status: "판매중" }).toArray();
  const watchWindowStart = new Date(now.getTime() - PRICE_EVALUATION_INTERVAL_MS);
  const summary = {
    checked: sellingProducts.length,
    due: 0,
    increased: 0,
    decreased: 0,
    kept: 0,
  };

  for (const product of sellingProducts) {
    const productId = product._id.toString();
    const latestPriceChange = await priceChanges.findOne(
      { productId },
      { sort: { seq: -1 } },
    );

    if (!force) {
      const lastEvaluatedAt = latestPriceChange?.changedAt ?? product.createdAt;
      const nextEvaluationAt = new Date(
        lastEvaluatedAt.getTime() + PRICE_EVALUATION_INTERVAL_MS,
      );

      if (nextEvaluationAt > now) continue;
    }

    summary.due += 1;

    const newWatchCount = await watchlists.countDocuments({
      productId,
      createdAt: {
        $gt: watchWindowStart,
        $lte: now,
      },
    });
    const evaluation = calculatePriceEvaluation({
      initialPrice: product.initialPrice,
      currentPrice: product.currentPrice,
      minimumPrice: product.minimumPrice,
      newWatchCount,
    });
    const priceChange = {
      _id: new ObjectId(),
      productId,
      changedAt: now,
      previousPrice: product.currentPrice,
      newPrice: evaluation.newPrice,
      seq: (latestPriceChange?.seq ?? -1) + 1,
      reason: evaluation.reason,
      status: evaluation.status,
    };

    if (evaluation.status === "KEEP") {
      try {
        await priceChanges.insertOne(priceChange);
        summary.kept += 1;
      } catch (error) {
        if (error?.code !== 11000) throw error;
      }
      continue;
    }

    const updateResult = await products.updateOne(
      {
        _id: product._id,
        status: "판매중",
        currentPrice: product.currentPrice,
      },
      { $set: { currentPrice: evaluation.newPrice } },
    );

    if (updateResult.modifiedCount !== 1) continue;

    try {
      await priceChanges.insertOne(priceChange);
      if (evaluation.status === "UP") summary.increased += 1;
      else summary.decreased += 1;
    } catch (error) {
      await products.updateOne(
        {
          _id: product._id,
          status: "판매중",
          currentPrice: evaluation.newPrice,
        },
        { $set: { currentPrice: product.currentPrice } },
      );
      throw error;
    }
  }

  return summary;
}

export async function randomizeDemoWatchlists({
  database,
  now = new Date(),
  random = Math.random,
}) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError("관심 데이터 생성 시각이 올바른 Date여야 합니다.");
  }

  const products = database.collection("products");
  const users = database.collection("users");
  const watchlists = database.collection("watchlists");
  const [sellingProducts, demoUsers] = await Promise.all([
    products.find({ status: "판매중" }).toArray(),
    users
      .find(
        { email: { $regex: /@daepa\.test$/ } },
        { projection: { _id: 1 } },
      )
      .toArray(),
  ]);
  const demoUserIds = demoUsers.map((user) => user._id.toString());
  let mockInterestCount = 0;

  for (const product of sellingProducts) {
    const productId = product._id.toString();
    const candidateUserIds = demoUserIds.filter(
      (userId) => userId !== product.sellerId,
    );

    await watchlists.deleteMany({
      productId,
      userId: { $in: demoUserIds },
    });

    const maximumInterestCount = Math.min(10, candidateUserIds.length);
    const interestCount = Math.floor(random() * (maximumInterestCount + 1));

    if (interestCount === 0) continue;

    const startIndex = Math.floor(random() * candidateUserIds.length);
    const selectedUserIds = Array.from(
      { length: interestCount },
      (_, offset) =>
        candidateUserIds[(startIndex + offset) % candidateUserIds.length],
    );

    await watchlists.insertMany(
      selectedUserIds.map((userId) => ({
        _id: new ObjectId(),
        productId,
        userId,
        createdAt: now,
      })),
    );
    mockInterestCount += selectedUserIds.length;
  }

  return { mockInterestCount };
}

export async function adjustProductPrices(
  now = new Date(),
  { force = false } = {},
) {
  const database = await getDatabase();
  return adjustDueProductPrices({ database, now, force });
}

export async function adjustMockProductPrices(
  now = new Date(),
  random = Math.random,
) {
  const database = await getDatabase();
  const mockSummary = await randomizeDemoWatchlists({
    database,
    now,
    random,
  });
  const priceSummary = await adjustDueProductPrices({
    database,
    now,
    force: true,
  });

  return { ...priceSummary, ...mockSummary };
}
