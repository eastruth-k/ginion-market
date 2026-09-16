"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { completeProductPurchase } from "@/lib/transactions";
import { validateCheckoutForm } from "@/app/products/[id]/checkout/checkout-validation";

export async function completeMockCheckout(productId, previousState, formData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const validation = validateCheckoutForm(formData);
  if (validation.error) {
    return {
      error: validation.error,
      values: validation.values,
      completed: false,
      revision: (previousState?.revision ?? 0) + 1,
    };
  }

  let purchaseResult;

  try {
    purchaseResult = await completeProductPurchase(productId, session.user.id);
  } catch (error) {
    console.error("목업 결제 내역 저장 중 오류가 발생했습니다.", error);
    return {
      error: "목업 결제를 완료하지 못했습니다. 잠시 후 다시 시도해주세요.",
      values: validation.values,
      completed: false,
      revision: (previousState?.revision ?? 0) + 1,
    };
  }

  if (purchaseResult.error) {
    const errorMessage =
      purchaseResult.error === "OWN_PRODUCT"
        ? "본인이 등록한 상품은 구매할 수 없습니다."
        : "현재 구매할 수 없는 상품입니다.";

    return {
      error: errorMessage,
      values: validation.values,
      completed: false,
      revision: (previousState?.revision ?? 0) + 1,
    };
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
  revalidatePath("/mypage");
  revalidatePath("/my-board");

  return {
    error: "",
    values: {},
    completed: true,
    mockOrderNumber: `MOCK-${purchaseResult.transactionId.slice(-8).toUpperCase()}`,
    revision: (previousState?.revision ?? 0) + 1,
  };
}
