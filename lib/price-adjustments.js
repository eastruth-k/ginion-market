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
      summary.decreased += 1;
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

export async function adjustProductPrices(
  now = new Date(),
  { force = false } = {},
) {
  const database = await getDatabase();
  return adjustDueProductPrices({ database, now, force });
}
