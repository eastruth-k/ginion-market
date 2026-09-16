import assert from "node:assert/strict";
import test from "node:test";
import { validateProductForm } from "./product-validation.js";

function createValidFormData() {
  const formData = new FormData();
  formData.set("name", "테스트 상품");
  formData.set("category", "전자기기 > 테스트");
  formData.set("info", "상품 등록 검증 테스트입니다.");
  formData.set(
    "images",
    new File(["test image"], "test.png", { type: "image/png" }),
  );
  formData.set("region", "서울");
  formData.set("condition", "상");
  formData.set("initialPrice", "100000");
  formData.set("minimumPrice", "70000");
  return formData;
}

test("유효한 상품 등록 값을 숫자와 이미지 파일 배열로 변환한다", () => {
  const result = validateProductForm(createValidFormData());

  assert.equal(result.error, null);
  assert.equal(result.productData.initialPrice, 100000);
  assert.equal(result.productData.minimumPrice, 70000);
  assert.equal(result.values.name, "테스트 상품");
  assert.equal(result.productData.images.length, 1);
  assert.equal(result.productData.images[0].name, "test.png");
});

test("콤마가 포함된 가격을 숫자로 변환한다", () => {
  const formData = createValidFormData();
  formData.set("initialPrice", "100,000");
  formData.set("minimumPrice", "70,000");

  const result = validateProductForm(formData);
  assert.equal(result.error, null);
  assert.equal(result.productData.initialPrice, 100000);
  assert.equal(result.productData.minimumPrice, 70000);
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
  formData.delete("images");
  assert.equal(
    validateProductForm(formData).error,
    "상품 이미지를 1개에서 5개까지 첨부해주세요.",
  );

  for (let index = 0; index < 6; index += 1) {
    formData.append(
      "images",
      new File([`image ${index}`], `${index}.png`, { type: "image/png" }),
    );
  }
  assert.equal(
    validateProductForm(formData).error,
    "상품 이미지를 1개에서 5개까지 첨부해주세요.",
  );
});

test("허용하지 않는 형식의 이미지 파일을 거부한다", () => {
  const formData = createValidFormData();
  formData.set(
    "images",
    new File(["not an image"], "test.svg", { type: "image/svg+xml" }),
  );

  assert.equal(
    validateProductForm(formData).error,
    "상품 이미지는 JPG, PNG, WEBP, GIF 파일만 첨부할 수 있습니다.",
  );
});

test("5MB를 초과한 이미지 파일을 거부한다", () => {
  const formData = createValidFormData();
  formData.set(
    "images",
    new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", {
      type: "image/png",
    }),
  );

  assert.equal(
    validateProductForm(formData).error,
    "상품 이미지 한 개의 크기는 5MB 이하여야 합니다.",
  );
});
