import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function hasWatchlist(userId, productId) {
  const database = await getDatabase();
  return Boolean(await database.collection("watchlists").findOne({ userId, productId }));
}

export async function toggleWatchlist(userId, productId) {
  if (!ObjectId.isValid(productId)) return false;

  const database = await getDatabase();
  const watchlists = database.collection("watchlists");
  const existing = await watchlists.findOne({ userId, productId });

  if (existing) {
    await watchlists.deleteOne({ _id: existing._id });
    return false;
  }

  const productExists = await database.collection("products").findOne({
    _id: new ObjectId(productId),
    status: { $in: ["판매중", "예약중"] },
  });
  if (!productExists) return false;

  await watchlists.insertOne({
    _id: new ObjectId(),
    userId,
    productId,
    createdAt: new Date(),
  });
  return true;
}

export async function getWatchlistProducts(userId) {
  const database = await getDatabase();
  const watchlists = await database
    .collection("watchlists")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
  const productIds = watchlists
    .map((watchlist) => watchlist.productId)
    .filter((productId) => ObjectId.isValid(productId))
    .map((productId) => new ObjectId(productId));

  if (productIds.length === 0) return [];

  return database.collection("products").find({ _id: { $in: productIds } }).toArray();
}
