import assert from "node:assert/strict";
import test from "node:test";
import { calculatePriceEvaluation } from "./price-adjustment-policy.js";

test("신규 관심이 없으면 현재 가격을 3% 인하한다", () => {
  assert.deepEqual(
    calculatePriceEvaluation({
      currentPrice: 100000,
      minimumPrice: 70000,
      newWatchCount: 0,
    }),
    {
      newPrice: 97000,
      status: "DOWN",
      reason: "신규 관심이 없어 가격을 3% 인하",
    },
  );
});

test("신규 관심이 한 건 이상이면 가격을 유지한다", () => {
  const result = calculatePriceEvaluation({
    currentPrice: 100000,
    minimumPrice: 70000,
    newWatchCount: 2,
  });

  assert.equal(result.newPrice, 100000);
  assert.equal(result.status, "KEEP");
  assert.match(result.reason, /신규 관심 2건/);
});

test("3% 인하 가격이 최저 가격보다 낮으면 최저 가격까지만 내린다", () => {
  const result = calculatePriceEvaluation({
    currentPrice: 71000,
    minimumPrice: 70000,
    newWatchCount: 0,
  });

  assert.equal(result.newPrice, 70000);
  assert.equal(result.status, "DOWN");
  assert.match(result.reason, /최저 판매 가격/);
});

test("이미 최저 가격이면 신규 관심이 없어도 가격을 유지한다", () => {
  const result = calculatePriceEvaluation({
    currentPrice: 70000,
    minimumPrice: 70000,
    newWatchCount: 0,
  });

  assert.equal(result.newPrice, 70000);
  assert.equal(result.status, "KEEP");
  assert.match(result.reason, /최저 판매 가격에 도달/);
});

test("잘못된 가격이나 관심 수를 거부한다", () => {
  assert.throws(() =>
    calculatePriceEvaluation({
      currentPrice: 0,
      minimumPrice: 1,
      newWatchCount: 0,
    }),
  );
  assert.throws(() =>
    calculatePriceEvaluation({
      currentPrice: 10000,
      minimumPrice: 11000,
      newWatchCount: 0,
    }),
  );
  assert.throws(() =>
    calculatePriceEvaluation({
      currentPrice: 10000,
      minimumPrice: 9000,
      newWatchCount: -1,
    }),
  );
});
