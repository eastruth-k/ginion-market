import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function getPopularProducts(limit = 4) {
  const database = await getDatabase();

  return database
    .collection("products")
    .aggregate([
      { $match: { status: { $in: ["판매중", "예약중"] } } },
      {
        $lookup: {
          from: "watchlists",
          let: { productId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$productId", "$$productId"] } } },
          ],
          as: "watchlists",
        },
      },
      { $set: { watchCount: { $size: "$watchlists" } } },
      { $unset: "watchlists" },
      {
        $lookup: {
          from: "priceChange",
          let: { productId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$productId", "$$productId"] } } },
            { $sort: { seq: -1 } },
            { $limit: 1 },
          ],
          as: "latestPriceChange",
        },
      },
      { $set: { latestPriceChange: { $first: "$latestPriceChange" } } },
      { $sort: { watchCount: -1, createdAt: -1 } },
      { $limit: limit },
    ])
    .toArray();
}

export async function getSoonProducts(limit = 4) {
  const database = await getDatabase();

  return database
    .collection("products")
    .aggregate([
      { $match: { status: "판매중" } },
      {
        $lookup: {
          from: "priceChange",
          let: { productId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$productId", "$$productId"] } } },
            { $sort: { seq: -1 } },
            { $limit: 1 },
          ],
          as: "latestPriceChange",
        },
      },
      { $set: { latestPriceChange: { $first: "$latestPriceChange" } } },
      {
        $lookup: {
          from: "watchlists",
          let: { productId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$productId", "$$productId"] } } },
          ],
          as: "watchlists",
        },
      },
      { $set: { watchCount: { $size: "$watchlists" } } },
      { $unset: "watchlists" },
      { $sort: { "latestPriceChange.changedAt": 1, createdAt: 1 } },
      { $limit: limit },
    ])
    .toArray();
}

export async function getProducts(filters = {}) {
  const database = await getDatabase();
  const query = { status: { $in: ["판매중", "예약중"] } };
  const keyword = typeof filters.q === "string" ? filters.q.trim() : "";
  const category = typeof filters.category === "string" ? filters.category : "";
  const region = typeof filters.region === "string" ? filters.region.trim() : "";
  const minimumPrice = Number(filters.minimumPrice);
  const maximumPrice = Number(filters.maximumPrice);

  if (keyword) {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { name: { $regex: escapedKeyword, $options: "i" } },
      { category: { $regex: escapedKeyword, $options: "i" } },
      { info: { $regex: escapedKeyword, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (region) {
    const escapedRegion = region.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.region = { $regex: escapedRegion, $options: "i" };
  }

  if (Number.isFinite(minimumPrice) || Number.isFinite(maximumPrice)) {
    query.currentPrice = {};
    if (Number.isFinite(minimumPrice)) query.currentPrice.$gte = minimumPrice;
    if (Number.isFinite(maximumPrice)) query.currentPrice.$lte = maximumPrice;
  }

  const sortOptions = {
    oldest: { createdAt: 1 },
    priceLow: { currentPrice: 1 },
    priceHigh: { currentPrice: -1 },
    interest: { watchCount: -1, createdAt: -1 },
    discount: { discountRate: -1, createdAt: -1 },
  };
  const sort = sortOptions[filters.sort] ?? { createdAt: -1 };

  return database.collection("products").aggregate([
    { $match: query },
    {
      $lookup: {
        from: "watchlists",
        let: { productId: { $toString: "$_id" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$productId", "$$productId"] } } },
        ],
        as: "watchlists",
      },
    },
    {
      $lookup: {
        from: "priceChange",
        let: { productId: { $toString: "$_id" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$productId", "$$productId"] } } },
          { $sort: { seq: -1 } },
          { $limit: 1 },
        ],
        as: "latestPriceChange",
      },
    },
    {
      $set: {
        watchCount: { $size: "$watchlists" },
        latestPriceChange: { $first: "$latestPriceChange" },
        discountRate: {
          $divide: [{ $subtract: ["$initialPrice", "$currentPrice"] }, "$initialPrice"],
        },
      },
    },
    { $unset: "watchlists" },
    { $sort: sort },
  ]).toArray();
}

export async function getProductCategories() {
  const database = await getDatabase();
  return database.collection("products").distinct("category", {
    status: { $in: ["판매중", "예약중"] },
  });
}

export async function getProductById(productId) {
  if (!ObjectId.isValid(productId)) return null;

  const database = await getDatabase();
  const product = await database
    .collection("products")
    .findOne({ _id: new ObjectId(productId) });

  if (!product) return null;

  const [seller, priceChanges, watchCount] = await Promise.all([
    database.collection("users").findOne({ _id: new ObjectId(product.sellerId) }),
    database
      .collection("priceChange")
      .find({ productId })
      .sort({ seq: 1 })
      .toArray(),
    database.collection("watchlists").countDocuments({ productId }),
  ]);

  return { product, seller, priceChanges, watchCount };
}

export async function createProduct(productData) {
  const database = await getDatabase();
  const productId = new ObjectId();
  const priceChangeId = new ObjectId();
  const createdAt = new Date();

  const product = {
    _id: productId,
    images: productData.images,
    name: productData.name,
    category: productData.category,
    info: productData.info,
    initialPrice: productData.initialPrice,
    minimumPrice: productData.minimumPrice,
    currentPrice: productData.initialPrice,
    region: productData.region,
    condition: productData.condition,
    status: "판매중",
    createdAt,
    sellerId: productData.sellerId,
  };

  await database.collection("products").insertOne(product);

  try {
    await database.collection("priceChange").insertOne({
      _id: priceChangeId,
      productId: productId.toString(),
      changedAt: createdAt,
      previousPrice: productData.initialPrice,
      newPrice: productData.initialPrice,
      seq: 0,
      reason: "상품 최초 등록",
      status: "KEEP",
    });
  } catch (error) {
    await database.collection("products").deleteOne({ _id: productId });
    throw error;
  }

  return productId.toString();
}
