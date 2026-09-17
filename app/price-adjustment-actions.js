"use server";

import { revalidatePath } from "next/cache";
import { adjustMockProductPrices } from "@/lib/price-adjustments";

export async function runPriceAdjustment() {
  try {
    const summary = await adjustMockProductPrices();

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/products/[id]", "page");

    return {
      status: "success",
      message: `랜덤 관심 ${summary.mockInterestCount}개 · 상승 ${summary.increased}개 · 인하 ${summary.decreased}개 · 유지 ${summary.kept}개`,
    };
  } catch (error) {
    console.error("수동 가격 재책정에 실패했습니다.", error);

    return {
      status: "error",
      message: "가격 재책정에 실패했습니다. 다시 시도해주세요.",
    };
  }
}
