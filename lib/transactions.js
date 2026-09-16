import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function completeProductPurchase(productId, buyerId) {
  if (!ObjectId.isValid(productId)) {
    return { error: "UNAVAILABLE" };
  }

  const database = await getDatabase();
  const products = database.collection("products");
  const transactions = database.collection("transactions");
  const priceChanges = database.collection("priceChange");
  const productObjectId = new ObjectId(productId);
  const existingProduct = await products.findOne({ _id: productObjectId });

  if (!existingProduct || existingProduct.status !== "판매중") {
    return { error: "UNAVAILABLE" };
  }

  if (existingProduct.sellerId === buyerId) {
    return { error: "OWN_PRODUCT" };
  }

  const product = await products.findOneAndUpdate(
    {
      _id: productObjectId,
      status: "판매중",
      sellerId: { $ne: buyerId },
    },
    { $set: { status: "판매 완료" } },
    { returnDocument: "before" },
  );

  if (!product) {
    return { error: "UNAVAILABLE" };
  }

  const transactionId = new ObjectId();
  const priceChangeId = new ObjectId();
  const createdAt = new Date();
  const latestPriceChange = await priceChanges.findOne(
    { productId },
    { sort: { seq: -1 } },
  );

  try {
    await transactions.insertOne({
      _id: transactionId,
      buyerId,
      sellerId: product.sellerId,
      productId,
      price: product.currentPrice,
      createdAt,
    });

    await priceChanges.insertOne({
      _id: priceChangeId,
      productId,
      changedAt: createdAt,
      previousPrice: product.currentPrice,
      newPrice: product.currentPrice,
      seq: (latestPriceChange?.seq ?? -1) + 1,
      reason: `${product.currentPrice.toLocaleString()}원에 거래가 성사되어 판매 완료`,
      status: "KEEP",
    });
  } catch (error) {
    await transactions.deleteOne({ _id: transactionId });
    await products.updateOne(
      { _id: productObjectId, status: "판매 완료" },
      { $set: { status: "판매중" } },
    );
    throw error;
  }

  try {
    await database.collection("watchlists").deleteMany({ productId });
  } catch (error) {
    console.error("판매 완료 상품의 관심 목록 정리에 실패했습니다.", error);
  }

  return {
    error: null,
    transactionId: transactionId.toString(),
  };
}
