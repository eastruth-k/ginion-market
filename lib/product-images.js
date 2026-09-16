import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export async function saveProductImages(images, sellerId) {
  const database = await getDatabase();
  const imageDocuments = await Promise.all(
    images.map(async (image) => ({
      _id: new ObjectId(),
      data: Buffer.from(await image.arrayBuffer()),
      contentType: image.type,
      originalName: image.name,
      sellerId,
      createdAt: new Date(),
    })),
  );

  try {
    await database.collection("productImages").insertMany(imageDocuments);
  } catch (error) {
    await database.collection("productImages").deleteMany({
      _id: { $in: imageDocuments.map((image) => image._id) },
    });
    throw error;
  }

  return imageDocuments.map((image) => ({
    id: image._id,
    url: `/api/product-images/${image._id.toString()}`,
  }));
}

export async function deleteProductImages(imageIds) {
  if (imageIds.length === 0) return;

  const database = await getDatabase();
  await database.collection("productImages").deleteMany({
    _id: { $in: imageIds },
  });
}

export async function getProductImage(imageId) {
  if (!ObjectId.isValid(imageId)) return null;

  const database = await getDatabase();
  return database.collection("productImages").findOne({
    _id: new ObjectId(imageId),
  });
}
