import assert from "node:assert/strict";
import test from "node:test";
import { validateCheckoutForm } from "./checkout-validation.js";

function createValidCheckoutFormData() {
  const formData = new FormData();
  formData.set("buyerName", "구매자");
  formData.set("phone", "010-1234-5678");
  formData.set("address", "서울특별시 강남구 역삼동");
  formData.set("deliveryRequest", "문 앞에 놓아주세요.");
  formData.set("paymentMethod", "card");
  formData.set("agreement", "yes");
  return formData;
}

test("유효한 목업 결제 정보를 정리한다", () => {
  const result = validateCheckoutForm(createValidCheckoutFormData());

  assert.equal(result.error, null);
  assert.equal(result.checkoutData.phone, "010-1234-5678");
  assert.equal(result.checkoutData.paymentMethod, "card");
});

test("잘못된 휴대전화 번호를 거부한다", () => {
  const formData = createValidCheckoutFormData();
  formData.set("phone", "02-123-4567");

  assert.equal(
    validateCheckoutForm(formData).error,
    "연락처를 휴대전화 번호 형식으로 입력해주세요.",
  );
});

test("결제수단을 선택하지 않으면 거부한다", () => {
  const formData = createValidCheckoutFormData();
  formData.delete("paymentMethod");

  assert.equal(
    validateCheckoutForm(formData).error,
    "결제수단을 선택해주세요.",
  );
});

test("목업 결제 안내에 동의하지 않으면 거부한다", () => {
  const formData = createValidCheckoutFormData();
  formData.delete("agreement");

  assert.equal(
    validateCheckoutForm(formData).error,
    "목업 결제 안내를 확인하고 동의해주세요.",
  );
});
