import { getProductImage } from "@/lib/product-images";

export async function GET(request, { params }) {
  const { id } = await params;
  const image = await getProductImage(id);

  if (!image) {
    return new Response("이미지를 찾을 수 없습니다.", { status: 404 });
  }

  const imageData = Buffer.isBuffer(image.data)
    ? image.data
    : image.data.buffer;

  return new Response(imageData, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": image.contentType,
      "Content-Length": imageData.byteLength.toString(),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
