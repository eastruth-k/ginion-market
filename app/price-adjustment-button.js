"use client";

import { useActionState } from "react";
import { runPriceAdjustment } from "./price-adjustment-actions";

const initialState = {
  status: "idle",
  message: "",
};

export default function PriceAdjustmentButton() {
  const [state, formAction, pending] = useActionState(
    runPriceAdjustment,
    initialState,
  );

  return (
    <form action={formAction} className="price-adjustment-demo">
      <span>목업 시연</span>
      <button type="submit" disabled={pending}>
        {pending ? "가격 책정 중..." : "🔪 가격 재책정"}
      </button>
      <p
        className={state.status === "error" ? "price-adjustment-error" : ""}
        aria-live="polite"
      >
        {state.message}
      </p>
    </form>
  );
}
