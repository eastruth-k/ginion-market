import { getDatabase } from "@/lib/mongodb";

export async function getUserActivity(userId) {
  const database = await getDatabase();
  const [sellingCount, purchaseCount, watchlistCount] = await Promise.all([
    database.collection("products").countDocuments({ sellerId: userId, status: "판매중" }),
    database.collection("transactions").countDocuments({ buyerId: userId }),
    database.collection("watchlists").countDocuments({ userId }),
  ]);

  return { sellingCount, purchaseCount, watchlistCount };
}

export async function getMyPageData(userId) {
  const database = await getDatabase();

  const [sellingProducts, purchases, watchlists] = await Promise.all([
    database
      .collection("products")
      .find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .toArray(),
    database
      .collection("transactions")
      .aggregate([
        { $match: { buyerId: userId } },
        { $sort: { createdAt: -1 } },
        {
          $set: {
            productObjectId: {
              $convert: {
                input: "$productId",
                to: "objectId",
                onError: null,
                onNull: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productObjectId",
            foreignField: "_id",
            as: "products",
          },
        },
        { $set: { product: { $first: "$products" } } },
        { $unset: ["products", "productObjectId"] },
        { $match: { product: { $ne: null } } },
      ])
      .toArray(),
    database
      .collection("watchlists")
      .aggregate([
        { $match: { userId } },
        { $sort: { createdAt: -1 } },
        {
          $set: {
            productObjectId: {
              $convert: {
                input: "$productId",
                to: "objectId",
                onError: null,
                onNull: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productObjectId",
            foreignField: "_id",
            as: "products",
          },
        },
        { $set: { product: { $first: "$products" } } },
        { $unset: ["products", "productObjectId"] },
        { $match: { product: { $ne: null } } },
      ])
      .toArray(),
  ]);

  return {
    activity: {
      sellingCount: sellingProducts.filter(
        (product) => product.status === "판매중",
      ).length,
      purchaseCount: purchases.length,
      watchlistCount: watchlists.length,
    },
    sellingProducts,
    purchases,
    watchlists,
  };
}
