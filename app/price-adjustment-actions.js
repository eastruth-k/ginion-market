"use server";

import { revalidatePath } from "next/cache";
import { adjustProductPrices } from "@/lib/price-adjustments";

export async function runPriceAdjustment() {
  try {
    const summary = await adjustProductPrices(new Date(), { force: true });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/products/[id]", "page");

    return {
      status: "success",
      message: `가격 인하 ${summary.decreased}개 · 가격 유지 ${summary.kept}개`,
    };
  } catch (error) {
    console.error("수동 가격 재책정에 실패했습니다.", error);

    return {
      status: "error",
      message: "가격 재책정에 실패했습니다. 다시 시도해주세요.",
    };
  }
}
