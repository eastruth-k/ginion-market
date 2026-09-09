import { getDatabase } from "@/lib/mongodb";

export async function getUserActivity(userId) {
  const database = await getDatabase();
  const [sellingCount, purchaseCount, watchlistCount] = await Promise.all([
    database.collection("products").countDocuments({ sellerId: userId, status: { $in: ["판매중", "예약중"] } }),
    database.collection("transactions").countDocuments({ buyerId: userId }),
    database.collection("watchlists").countDocuments({ userId }),
  ]);

  return { sellingCount, purchaseCount, watchlistCount };
}
