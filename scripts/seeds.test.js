import assert from "node:assert/strict";
import test from "node:test";
import { products } from "./seeds.js";

test("상품 ID는 서로 중복되지 않는다", () => {
  const productIds = products.map((product) => product.id);
  const uniqueProductIds = new Set(productIds);

  assert.equal(uniqueProductIds.size, productIds.length);
});

test("모든 상품 가격은 판매자가 정한 범위 안에 있다", () => {
  for (const product of products) {
    assert.ok(product.currentPrice <= product.initialPrice);
    assert.ok(product.currentPrice >= product.minimumPrice);
  }
});

test("모든 상품은 검색과 가격 조정에 필요한 데이터를 갖는다", () => {
  for (const product of products) {
    assert.ok(product.sellerId);
    assert.ok(product.description);
    assert.ok(product.category);
    assert.ok(product.region.city);
    assert.ok(product.region.district);
    assert.ok(product.marketPrice > 0);
    assert.ok(product.viewCount >= 0);
    assert.ok(product.clickCount >= 0);
    assert.ok(product.favoriteCount >= 0);
    assert.ok(product.nextAdjustmentAt instanceof Date);
  }
});

test("최근 가격 이력은 현재 가격과 일치한다", () => {
  for (const product of products) {
    const latestPriceHistory = product.priceHistory.at(-1);

    assert.equal(latestPriceHistory.price, product.currentPrice);
  }
});
