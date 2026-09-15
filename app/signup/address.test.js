import assert from "node:assert/strict";
import test from "node:test";
import { createRegionAddress, isValidRegionAddress } from "./address.js";

test("Kakao 주소 결과를 시·군·구·동 형식으로 정규화한다", () => {
  assert.equal(
    createRegionAddress({
      sido: "경기",
      sigungu: "성남시 분당구",
      bname: "백현동",
    }),
    "경기도 성남시 분당구 백현동",
  );
});

test("특별자치도 약칭을 정식 명칭으로 변환한다", () => {
  assert.equal(
    createRegionAddress({ sido: "강원", sigungu: "춘천시", bname: "효자동" }),
    "강원특별자치도 춘천시 효자동",
  );
});

test("정규화된 국내 지역 주소만 허용한다", () => {
  assert.equal(isValidRegionAddress("서울특별시 강남구 역삼동"), true);
  assert.equal(isValidRegionAddress("경기도 성남시 분당구 백현동"), true);
  assert.equal(isValidRegionAddress("강남구 역삼동"), false);
  assert.equal(isValidRegionAddress("https://example.com"), false);
});
