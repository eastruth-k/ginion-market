import assert from "node:assert/strict";
import test from "node:test";
import { ObjectId } from "mongodb";
import {
  adjustDueProductPrices,
  randomizeDemoWatchlists,
} from "./price-adjustments.js";

function createFakeDatabase({
  product,
  latestPriceChange,
  newWatchCount,
  insertError,
}) {
  const insertedPriceChanges = [];
  const watchQueries = [];
  const productUpdates = [];

  const collections = {
    products: {
      find(query) {
        assert.deepEqual(query, { status: "판매중" });
        return { toArray: async () => [product] };
      },
      async updateOne(query, update) {
        productUpdates.push({ query, update });
        product.currentPrice = update.$set.currentPrice;
        return { modifiedCount: 1 };
      },
    },
    watchlists: {
      async countDocuments(query) {
        watchQueries.push(query);
        return newWatchCount;
      },
    },
    priceChange: {
      async findOne(query, options) {
        assert.deepEqual(query, { productId: product._id.toString() });
        assert.deepEqual(options, { sort: { seq: -1 } });
        return latestPriceChange;
      },
      async insertOne(document) {
        if (insertError) throw insertError;
        insertedPriceChanges.push(document);
        return { insertedId: document._id };
      },
    },
  };

  return {
    database: {
      collection(name) {
        return collections[name];
      },
    },
    insertedPriceChanges,
    productUpdates,
    watchQueries,
  };
}

test("마지막 평가 후 24시간이 지난 판매중 상품의 가격을 3% 인하한다", async () => {
  const product = {
    _id: new ObjectId("66e000000000000000000001"),
    initialPrice: 120000,
    currentPrice: 100000,
    minimumPrice: 70000,
    status: "판매중",
    createdAt: new Date("2026-09-15T00:00:00.000Z"),
  };
  const latestPriceChange = {
    changedAt: new Date("2026-09-15T12:00:00.000Z"),
    seq: 2,
  };
  const now = new Date("2026-09-17T00:00:00.000Z");
  const fake = createFakeDatabase({
    product,
    latestPriceChange,
    newWatchCount: 0,
  });

  const summary = await adjustDueProductPrices({
    database: fake.database,
    now,
  });

  assert.deepEqual(summary, {
    checked: 1,
    due: 1,
    increased: 0,
    decreased: 1,
    kept: 0,
  });
  assert.equal(product.currentPrice, 97000);
  assert.equal(fake.productUpdates.length, 1);
  assert.equal(fake.insertedPriceChanges.length, 1);
  assert.deepEqual(
    {
      ...fake.insertedPriceChanges[0],
      _id: undefined,
    },
    {
      _id: undefined,
      productId: product._id.toString(),
      changedAt: now,
      previousPrice: 100000,
      newPrice: 97000,
      seq: 3,
      reason: "신규 관심이 없어 가격을 3% 인하",
      status: "DOWN",
    },
  );
  assert.deepEqual(fake.watchQueries[0].createdAt, {
    $gt: new Date("2026-09-16T00:00:00.000Z"),
    $lte: now,
  });
});

test("최근 24시간에 신규 관심이 있으면 가격을 유지하고 KEEP 기록을 남긴다", async () => {
  const product = {
    _id: new ObjectId("66e000000000000000000002"),
    initialPrice: 120000,
    currentPrice: 100000,
    minimumPrice: 70000,
    status: "판매중",
    createdAt: new Date("2026-09-15T00:00:00.000Z"),
  };
  const now = new Date("2026-09-17T00:00:00.000Z");
  const fake = createFakeDatabase({
    product,
    latestPriceChange: null,
    newWatchCount: 1,
  });

  const summary = await adjustDueProductPrices({
    database: fake.database,
    now,
  });

  assert.deepEqual(summary, {
    checked: 1,
    due: 1,
    increased: 0,
    decreased: 0,
    kept: 1,
  });
  assert.equal(fake.productUpdates.length, 0);
  assert.equal(fake.insertedPriceChanges[0].newPrice, 100000);
  assert.equal(fake.insertedPriceChanges[0].status, "KEEP");
  assert.equal(fake.insertedPriceChanges[0].seq, 0);
});

test("최근 24시간 신규 관심이 5건이면 가격을 3% 상승한다", async () => {
  const product = {
    _id: new ObjectId("66e000000000000000000006"),
    initialPrice: 120000,
    currentPrice: 100000,
    minimumPrice: 70000,
    status: "판매중",
    createdAt: new Date("2026-09-15T00:00:00.000Z"),
  };
  const fake = createFakeDatabase({
    product,
    latestPriceChange: null,
    newWatchCount: 5,
  });

  const summary = await adjustDueProductPrices({
    database: fake.database,
    now: new Date("2026-09-17T00:00:00.000Z"),
  });

  assert.deepEqual(summary, {
    checked: 1,
    due: 1,
    increased: 1,
    decreased: 0,
    kept: 0,
  });
  assert.equal(product.currentPrice, 103000);
  assert.equal(fake.insertedPriceChanges[0].status, "UP");
});

test("마지막 평가 후 24시간이 지나지 않은 상품은 평가하지 않는다", async () => {
  const product = {
    _id: new ObjectId("66e000000000000000000003"),
    initialPrice: 120000,
    currentPrice: 100000,
    minimumPrice: 70000,
    status: "판매중",
    createdAt: new Date("2026-09-16T18:00:00.000Z"),
  };
  const fake = createFakeDatabase({
    product,
    latestPriceChange: null,
    newWatchCount: 0,
  });

  const summary = await adjustDueProductPrices({
    database: fake.database,
    now: new Date("2026-09-17T00:00:00.000Z"),
  });

  assert.deepEqual(summary, {
    checked: 1,
    due: 0,
    increased: 0,
    decreased: 0,
    kept: 0,
  });
  assert.equal(fake.watchQueries.length, 0);
  assert.equal(fake.productUpdates.length, 0);
  assert.equal(fake.insertedPriceChanges.length, 0);
});

test("강제 실행은 24시간이 지나지 않은 상품도 즉시 평가한다", async () => {
  const product = {
    _id: new ObjectId("66e000000000000000000004"),
    initialPrice: 120000,
    currentPrice: 100000,
    minimumPrice: 70000,
    status: "판매중",
    createdAt: new Date("2026-09-16T23:00:00.000Z"),
  };
  const fake = createFakeDatabase({
    product,
    latestPriceChange: null,
    newWatchCount: 0,
  });

  const summary = await adjustDueProductPrices({
    database: fake.database,
    now: new Date("2026-09-17T00:00:00.000Z"),
    force: true,
  });

  assert.deepEqual(summary, {
    checked: 1,
    due: 1,
    increased: 0,
    decreased: 1,
    kept: 0,
  });
  assert.equal(product.currentPrice, 97000);
  assert.equal(fake.productUpdates.length, 1);
  assert.equal(fake.insertedPriceChanges.length, 1);
});

test("동시에 생성된 KEEP 기록의 중복 키 오류는 안전하게 건너뛴다", async () => {
  const product = {
    _id: new ObjectId("66e000000000000000000005"),
    initialPrice: 120000,
    currentPrice: 100000,
    minimumPrice: 70000,
    status: "판매중",
    createdAt: new Date("2026-09-15T00:00:00.000Z"),
  };
  const fake = createFakeDatabase({
    product,
    latestPriceChange: null,
    newWatchCount: 1,
    insertError: { code: 11000 },
  });

  const summary = await adjustDueProductPrices({
    database: fake.database,
    now: new Date("2026-09-17T00:00:00.000Z"),
    force: true,
  });

  assert.deepEqual(summary, {
    checked: 1,
    due: 1,
    increased: 0,
    decreased: 0,
    kept: 0,
  });
});

test("목업 가격 책정 전 데모 계정의 관심 데이터를 무작위로 다시 만든다", async () => {
  const product = {
    _id: new ObjectId("66e000000000000000000006"),
    sellerId: "66d000000000000000000001",
    status: "판매중",
  };
  const demoUsers = [
    "66d000000000000000000001",
    "66d000000000000000000002",
    "66d000000000000000000003",
    "66d000000000000000000004",
    "66d000000000000000000005",
    "66d000000000000000000006",
    "66d000000000000000000007",
    "66d000000000000000000008",
    "66d000000000000000000009",
    "66d00000000000000000000a",
    "66d00000000000000000000b",
  ].map((_id) => ({ _id: new ObjectId(_id) }));
  const deletedQueries = [];
  const insertedWatchlists = [];
  const collections = {
    products: {
      find(query) {
        assert.deepEqual(query, { status: "판매중" });
        return { toArray: async () => [product] };
      },
    },
    users: {
      find() {
        return { toArray: async () => demoUsers };
      },
    },
    watchlists: {
      async deleteMany(query) {
        deletedQueries.push(query);
      },
      async insertMany(documents) {
        insertedWatchlists.push(...documents);
      },
    },
  };
  const randomValues = [0.99, 0];
  const now = new Date("2026-09-17T00:00:00.000Z");

  const summary = await randomizeDemoWatchlists({
    database: {
      collection(name) {
        return collections[name];
      },
    },
    now,
    random: () => randomValues.shift(),
  });

  assert.deepEqual(summary, { mockInterestCount: 10 });
  assert.equal(deletedQueries.length, 1);
  assert.equal(insertedWatchlists.length, 10);
  assert.ok(
    insertedWatchlists.every(
      (watchlist) =>
        watchlist.productId === product._id.toString() &&
        watchlist.userId !== product.sellerId &&
        watchlist.createdAt === now,
    ),
  );
});
