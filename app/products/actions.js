"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createProduct } from "@/lib/products";

export async function registerProduct(formData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const name = formData.get("name")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString().trim() ?? "";
  const info = formData.get("info")?.toString().trim() ?? "";
  const region = formData.get("region")?.toString().trim() ?? "";
  const condition = formData.get("condition")?.toString() ?? "";
  const initialPrice = Number(formData.get("initialPrice"));
  const minimumPrice = Number(formData.get("minimumPrice"));
  const images = (formData.get("images")?.toString() ?? "")
    .split(/\r?\n/)
    .map((image) => image.trim())
    .filter(Boolean);

  const allowedConditions = ["최상", "상", "중", "하"];
  const hasValidPrices =
    Number.isInteger(initialPrice) &&
    Number.isInteger(minimumPrice) &&
    initialPrice > 0 &&
    minimumPrice > 0 &&
    minimumPrice <= initialPrice;

  if (
    !name ||
    !category ||
    !info ||
    !region ||
    !allowedConditions.includes(condition) ||
    !hasValidPrices ||
    images.length < 1 ||
    images.length > 5 ||
    images.some((image) => !URL.canParse(image))
  ) {
    redirect("/products/new?error=상품 정보와 가격, 이미지 URL을 확인해주세요.");
  }

  const productId = await createProduct({
    images,
    name,
    category,
    info,
    initialPrice,
    minimumPrice,
    region,
    condition,
    sellerId: session.user.id,
  });

  redirect(`/products/${productId}`);
}
