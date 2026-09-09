import assert from "node:assert/strict";
import test from "node:test";
import {
  priceChange,
  products,
  transactions,
  users,
  watchlists,
} from "./seeds.js";

const referenceTime = new Date("2026-09-09T06:00:00.000Z");

const expectedFields = {
  users: [
    "_id",
    "address",
    "createdAt",
    "email",
    "nickname",
    "passwordHash",
    "profileImage",
    "role",
  ],
  products: [
    "_id",
    "category",
    "createdAt",
    "images",
    "info",
    "initialPrice",
    "minimumPrice",
    "name",
    "condition",
    "currentPrice",
    "region",
    "sellerId",
    "status",
  ],
  watchlists: ["_id", "createdAt", "productId", "userId"],
  transactions: [
    "_id",
    "buyerId",
    "createdAt",
    "price",
    "productId",
    "sellerId",
  ],
  priceChange: [
    "_id",
    "changedAt",
    "newPrice",
    "previousPrice",
    "productId",
    "reason",
    "seq",
    "status",
  ],
};

function getMedian(numbers) {
  const sortedNumbers = [...numbers].sort((first, second) => first - second);
  const middleIndex = Math.floor(sortedNumbers.length / 2);

  if (sortedNumbers.length % 2 === 1) {
    return sortedNumbers[middleIndex];
  }

  return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
}

test("모든 문서는 README에 정의된 필드만 가진다", () => {
  const collections = {
    users,
    products,
    watchlists,
    transactions,
    priceChange,
  };

  for (const [collectionName, documents] of Object.entries(collections)) {
    for (const document of documents) {
      assert.deepEqual(
        Object.keys(document).sort(),
        [...expectedFields[collectionName]].sort(),
      );
    }
  }
});

test("모든 컬렉션의 ID는 MongoDB ObjectId 문자열 형식이며 중복되지 않는다", () => {
  const collections = [users, products, watchlists, transactions, priceChange];

  for (const documents of collections) {
    const ids = documents.map((document) => document._id);

    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) {
      assert.match(id, /^[0-9a-f]{24}$/);
    }
  }
});

test("회원 이메일과 관심목록 관계는 중복되지 않는다", () => {
  const emails = users.map((user) => user.email);
  const watchlistRelations = watchlists.map(
    (watchlist) => `${watchlist.userId}:${watchlist.productId}`,
  );

  assert.equal(new Set(emails).size, emails.length);
  assert.equal(new Set(watchlistRelations).size, watchlistRelations.length);
});

test("상품 가격과 이미지 개수는 허용 범위 안에 있다", () => {
  for (const product of products) {
    assert.ok(product.initialPrice > 0);
    assert.ok(product.minimumPrice > 0);
    assert.ok(product.minimumPrice <= product.currentPrice);
    assert.ok(product.currentPrice <= product.initialPrice);
    assert.ok(product.images.length >= 1);
    assert.ok(product.images.length <= 5);
  }
});

test("관심목록과 거래는 존재하는 회원과 상품만 참조한다", () => {
  const userIds = new Set(users.map((user) => user._id));
  const productIds = new Set(products.map((product) => product._id));

  for (const watchlist of watchlists) {
    assert.ok(userIds.has(watchlist.userId));
    assert.ok(productIds.has(watchlist.productId));
  }

  for (const transaction of transactions) {
    assert.ok(userIds.has(transaction.buyerId));
    assert.ok(userIds.has(transaction.sellerId));
    assert.notEqual(transaction.buyerId, transaction.sellerId);
    assert.ok(productIds.has(transaction.productId));
  }

  for (const product of products) {
    assert.ok(userIds.has(product.sellerId));
  }
});

test("거래 가격은 상품의 시작 가격과 최저 가격 사이에 있다", () => {
  const productsById = new Map(
    products.map((product) => [product._id, product]),
  );

  for (const transaction of transactions) {
    const product = productsById.get(transaction.productId);

    assert.ok(transaction.price <= product.initialPrice);
    assert.ok(transaction.price >= product.minimumPrice);
  }
});

test("모든 상품은 순서가 이어지는 가격 기록을 가진다", () => {
  for (const product of products) {
    const changes = priceChange
      .filter((change) => change.productId === product._id)
      .sort((first, second) => first.seq - second.seq);

    assert.ok(changes.length >= 1);

    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];

      assert.equal(change.seq, index);
      assert.ok(change.newPrice <= product.initialPrice);
      assert.ok(change.newPrice >= product.minimumPrice);

      if (index > 0) {
        assert.equal(change.previousPrice, changes[index - 1].newPrice);
        assert.ok(change.changedAt >= changes[index - 1].changedAt);
      }

      if (change.status === "KEEP") {
        assert.equal(change.previousPrice, change.newPrice);
      }

      if (change.status === "DOWN") {
        assert.ok(change.newPrice < change.previousPrice);
      }

      if (change.status === "UP") {
        assert.ok(change.newPrice > change.previousPrice);
      }
    }
  }
});

test("최근 48시간 안과 밖의 관심목록 테스트 데이터가 모두 있다", () => {
  const fortyEightHoursAgo = new Date(referenceTime.getTime() - 48 * 60 * 60 * 1000);
  const recentWatchlists = watchlists.filter(
    (watchlist) => watchlist.createdAt >= fortyEightHoursAgo,
  );
  const olderWatchlists = watchlists.filter(
    (watchlist) => watchlist.createdAt < fortyEightHoursAgo,
  );

  assert.ok(recentWatchlists.length > 0);
  assert.ok(olderWatchlists.length > 0);
});

test("최근 30일 거래의 중앙값을 계산할 수 있는 동일 상품군이 있다", () => {
  const airPodsName = "에어팟 프로 2세대 USB-C";
  const productIds = new Set(
    products
      .filter((product) => product.name === airPodsName)
      .map((product) => product._id),
  );
  const thirtyDaysAgo = new Date(referenceTime.getTime() - 30 * 24 * 60 * 60 * 1000);
  const prices = transactions
    .filter(
      (transaction) =>
        productIds.has(transaction.productId) &&
        transaction.createdAt >= thirtyDaysAgo,
    )
    .map((transaction) => transaction.price);

  assert.equal(prices.length, 3);
  assert.equal(getMedian(prices), 84000);
});

test("판매중, 예약중, 판매 완료 상태의 상품이 모두 있다", () => {
  const statuses = new Set(products.map((product) => product.status));

  assert.ok(statuses.has("판매중"));
  assert.ok(statuses.has("예약중"));
  assert.ok(statuses.has("판매 완료"));
});

test("등록 후 24시간이 지나지 않은 Cold Start 상품이 있다", () => {
  const twentyFourHoursAgo = new Date(referenceTime.getTime() - 24 * 60 * 60 * 1000);
  const coldStartProducts = products.filter(
    (product) => product.createdAt >= twentyFourHoursAgo,
  );

  assert.ok(coldStartProducts.length > 0);
});

test("KEEP과 DOWN 가격 기록이 모두 있다", () => {
  assert.ok(priceChange.some((change) => change.status === "KEEP"));
  assert.ok(priceChange.some((change) => change.status === "DOWN"));
});

test("상품 현재 가격은 마지막 가격 변경 기록과 같다", () => {
  for (const product of products) {
    const latestChange = priceChange
      .filter((change) => change.productId === product._id)
      .sort((first, second) => second.seq - first.seq)[0];

    assert.equal(product.currentPrice, latestChange.newPrice);
  }
});
