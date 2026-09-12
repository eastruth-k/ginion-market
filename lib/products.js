import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

// Teacher: aggregate는 DB에서 단계별로 문서를 바꿉니다. $match → 관심 목록 연결 → 개수 계산 → 최근 가격 연결 → 정렬·제한을 상품 2개로 따라가 보고, AI에게 find와 for...of로 풀어 쓴 버전을 요청해 보기.
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
  // Teacher: URL에서 빠진 값은 undefined, 빈 입력은 빈 문자열일 수 있습니다. Number(undefined)와 Number("")를 직접 비교하고, 빈 가격이 0원 조건이 되는지 AI와 검토해 보기.
  const minimumPrice = Number(filters.minimumPrice);
  const maximumPrice = Number(filters.maximumPrice);

  // Teacher: replace의 정규식은 검색어의 .·* 등을 문자 그대로 찾도록 이스케이프합니다. 점이 포함된 검색어로 변환 전후 결과를 비교하고, AI에게 정규식 각 기호와 대체 문자열을 풀어 설명하게 해 보기.
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

  // Teacher: $_id는 상품 필드, $$productId는 $lookup의 let 변수입니다. String 외래키를 연결한 뒤 $size·$first로 배열을 줄이는 과정을 써 보고, find 기반 대안에서도 정렬 결과가 같은지 확인해 보기.
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

  // Teacher: 세 조회는 같은 상품에 의존하지만 서로의 결과에는 의존하지 않습니다. Promise.all 배열 순서와 구조 분해 변수 순서를 맞춰 보고, await 세 줄로 쓴 대안의 실행 순서·실패 처리를 비교해 보기.
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

  // Teacher: 상품 저장 뒤 가격 이력 저장이 실패하면 catch에서 상품을 지웁니다. 두 컬렉션이 자동으로 함께 취소되는지 확인하고, 보상 삭제까지 실패하는 경우를 AI와 순서도로 분석해 보기.
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
