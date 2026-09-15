import assert from "node:assert/strict";
import test from "node:test";
import { validateProductForm } from "./product-validation.js";

function createValidFormData() {
  const formData = new FormData();
  formData.set("name", "테스트 상품");
  formData.set("category", "전자기기 > 테스트");
  formData.set("info", "상품 등록 검증 테스트입니다.");
  formData.set("images", "https://placehold.co/600x600.png?text=Test");
  formData.set("region", "서울");
  formData.set("condition", "상");
  formData.set("initialPrice", "100000");
  formData.set("minimumPrice", "70000");
  return formData;
}

test("유효한 상품 등록 값을 숫자와 이미지 배열로 변환한다", () => {
  const result = validateProductForm(createValidFormData());

  assert.equal(result.error, null);
  assert.equal(result.productData.initialPrice, 100000);
  assert.equal(result.productData.minimumPrice, 70000);
  assert.equal(result.values.name, "테스트 상품");
  assert.deepEqual(result.productData.images, [
    "https://placehold.co/600x600.png?text=Test",
  ]);
});

test("최저 가격이 시작 가격보다 높으면 구체적인 오류를 반환한다", () => {
  const formData = createValidFormData();
  formData.set("minimumPrice", "120000");

  const result = validateProductForm(formData);
  assert.equal(
    result.error,
    "판매 최저 가격은 시작 가격보다 높을 수 없습니다.",
  );
  assert.equal(result.values.minimumPrice, "120000");
});

test("이미지는 1개에서 5개까지만 허용한다", () => {
  const formData = createValidFormData();
  formData.set("images", "");
  assert.equal(
    validateProductForm(formData).error,
    "상품 이미지 URL을 한 줄에 하나씩, 1개에서 5개까지 입력해주세요.",
  );

  formData.set(
    "images",
    Array.from({ length: 6 }, (_, index) => `https://example.com/${index}.png`).join(
      "\n",
    ),
  );
  assert.equal(
    validateProductForm(formData).error,
    "상품 이미지 URL을 한 줄에 하나씩, 1개에서 5개까지 입력해주세요.",
  );
});

test("HTTP 또는 HTTPS가 아닌 이미지 주소를 거부한다", () => {
  for (const image of ["image.png", "file:///image.png", "javascript:alert(1)"]) {
    const formData = createValidFormData();
    formData.set("images", image);
    assert.equal(
      validateProductForm(formData).error,
      "이미지 주소는 http:// 또는 https://로 시작하는 URL이어야 합니다.",
    );
  }
});
