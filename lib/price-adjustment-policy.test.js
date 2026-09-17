import assert from "node:assert/strict";
import test from "node:test";
import { calculatePriceEvaluation } from "./price-adjustment-policy.js";

test("신규 관심이 없으면 현재 가격을 3% 인하한다", () => {
  assert.deepEqual(
    calculatePriceEvaluation({
      initialPrice: 120000,
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

test("신규 관심이 1~2건이면 가격을 유지한다", () => {
  const result = calculatePriceEvaluation({
    initialPrice: 120000,
    currentPrice: 100000,
    minimumPrice: 70000,
    newWatchCount: 2,
  });

  assert.equal(result.newPrice, 100000);
  assert.equal(result.status, "KEEP");
  assert.match(result.reason, /신규 관심 2건/);
});

test("신규 관심 구간에 따라 가격을 1%, 3%, 5% 상승한다", () => {
  const cases = [
    { newWatchCount: 3, expectedPrice: 101000, expectedPercent: 1 },
    { newWatchCount: 5, expectedPrice: 103000, expectedPercent: 3 },
    { newWatchCount: 10, expectedPrice: 105000, expectedPercent: 5 },
  ];

  for (const testCase of cases) {
    const result = calculatePriceEvaluation({
      initialPrice: 120000,
      currentPrice: 100000,
      minimumPrice: 70000,
      newWatchCount: testCase.newWatchCount,
    });

    assert.equal(result.newPrice, testCase.expectedPrice);
    assert.equal(result.status, "UP");
    assert.match(result.reason, new RegExp(`${testCase.expectedPercent}% 상승`));
  }
});

test("가격 상승은 최초 등록 가격을 넘지 않는다", () => {
  const cappedResult = calculatePriceEvaluation({
    initialPrice: 102000,
    currentPrice: 100000,
    minimumPrice: 70000,
    newWatchCount: 10,
  });
  const maximumResult = calculatePriceEvaluation({
    initialPrice: 100000,
    currentPrice: 100000,
    minimumPrice: 70000,
    newWatchCount: 10,
  });

  assert.equal(cappedResult.newPrice, 102000);
  assert.equal(cappedResult.status, "UP");
  assert.match(cappedResult.reason, /최초 등록 가격/);
  assert.equal(maximumResult.newPrice, 100000);
  assert.equal(maximumResult.status, "KEEP");
});

test("3% 인하 가격이 최저 가격보다 낮으면 최저 가격까지만 내린다", () => {
  const result = calculatePriceEvaluation({
    initialPrice: 100000,
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
    initialPrice: 100000,
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
      initialPrice: 10000,
      currentPrice: 0,
      minimumPrice: 1,
      newWatchCount: 0,
    }),
  );
  assert.throws(() =>
    calculatePriceEvaluation({
      initialPrice: 10000,
      currentPrice: 10000,
      minimumPrice: 11000,
      newWatchCount: 0,
    }),
  );
  assert.throws(() =>
    calculatePriceEvaluation({
      initialPrice: 10000,
      currentPrice: 10000,
      minimumPrice: 9000,
      newWatchCount: -1,
    }),
  );
  assert.throws(() =>
    calculatePriceEvaluation({
      initialPrice: 9000,
      currentPrice: 10000,
      minimumPrice: 7000,
      newWatchCount: 3,
    }),
  );
});
