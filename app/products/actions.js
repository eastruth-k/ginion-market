"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createProduct } from "@/lib/products";

export async function registerProduct(formData) {
  // Teacher: 화면에서 로그인 여부를 검사해도 Action은 다시 세션·입력을 확인해야 합니다. sellerId를 폼에서 받지 않고 session.user.id에서 정하는 이유와 HTML required만으로 부족한 이유를 설명해 보기.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const name = formData.get("name")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString().trim() ?? "";
  const info = formData.get("info")?.toString().trim() ?? "";
  const region = formData.get("region")?.toString().trim() ?? "";
  const condition = formData.get("condition")?.toString() ?? "";
  const initialPrice = Number(formData.get("initialPrice"));
  const minimumPrice = Number(formData.get("minimumPrice"));
  // Teacher: 문자열 → 줄별 배열 → 공백 제거 → 빈 줄 제거 순서입니다. 빈 줄과 공백이 섞인 URL 3줄을 넣어 중간값을 적고, AI에게 for...of와 if로 같은 검증을 표현하게 해 보기.
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
