"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isProductCategory } from "@/lib/categories";
import { deleteProductImages, saveProductImages } from "@/lib/product-images";
import { createProduct } from "@/lib/products";
import { validateProductForm } from "@/app/products/product-validation";

export async function registerProduct(previousState, formData) {
  // Teacher: 화면에서 로그인 여부를 검사해도 Action은 다시 세션·입력을 확인해야 합니다. sellerId를 폼에서 받지 않고 session.user.id에서 정하는 이유와 HTML required만으로 부족한 이유를 설명해 보기.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  // Teacher: 문자열 정리, 숫자 변환, 이미지 URL 검증은 product-validation.js에서 단계별로 처리합니다.
  const validation = validateProductForm(formData);
  if (validation.error) {
    return {
      error: validation.error,
      values: validation.values,
      revision: (previousState?.revision ?? 0) + 1,
    };
  }

  let productId;
  let savedImages = [];

  try {
    const categoryIsValid = await isProductCategory(
      validation.productData.category,
    );
    if (!categoryIsValid) {
      return {
        error: "카테고리를 다시 선택해주세요.",
        values: validation.values,
        revision: (previousState?.revision ?? 0) + 1,
      };
    }

    savedImages = await saveProductImages(
      validation.productData.images,
      session.user.id,
    );
    productId = await createProduct({
      ...validation.productData,
      images: savedImages.map((image) => image.url),
      sellerId: session.user.id,
    });
  } catch (error) {
    if (savedImages.length > 0) {
      try {
        await deleteProductImages(savedImages.map((image) => image.id));
      } catch (cleanupError) {
        console.error("저장된 상품 이미지 정리에 실패했습니다.", cleanupError);
      }
    }
    console.error("상품 등록 중 데이터베이스 오류가 발생했습니다.", error);
    return {
      error: "상품을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.",
      values: validation.values,
      revision: (previousState?.revision ?? 0) + 1,
    };
  }

  redirect(`/products/${productId}`);
}
