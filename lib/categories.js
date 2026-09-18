import { getDatabase } from "@/lib/mongodb";

export async function getProductCategories() {
  const database = await getDatabase();
  const categories = await database
    .collection("categories")
    .find({})
    .sort({ sortOrder: 1, name: 1 })
    .toArray();

  return categories.map((category) => category.name);
}

export async function isProductCategory(categoryName) {
  if (!categoryName) return false;

  const database = await getDatabase();
  const category = await database.collection("categories").findOne({
    name: categoryName,
  });

  return category !== null;
}
