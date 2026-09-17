import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { hashPassword } from "better-auth/crypto";
import { MongoClient, ObjectId } from "mongodb";

export const DEMO_USER_PASSWORD = "Demo1234!";

export const DEMO_USER_IDS = Object.freeze({
  admin: "66d000000000000000000001",
  minsu: "66d000000000000000000002",
  jiyun: "66d000000000000000000003",
  seojun: "66d000000000000000000004",
  yuna: "66d000000000000000000005",
});

export const users = [
  {
    _id: DEMO_USER_IDS.admin,
    email: "admin@daepa.test",
    emailVerified: true,
    nickname: "대파관리자",
    image: null,
    address: "서울특별시 강남구 역삼동",
    createdAt: new Date("2026-03-01T00:00:00.000Z"),
    updatedAt: new Date("2026-03-01T00:00:00.000Z"),
    role: "관리자",
  },
  {
    _id: DEMO_USER_IDS.minsu,
    email: "minsu@daepa.test",
    emailVerified: true,
    nickname: "민수마켓",
    image: null,
    address: "서울특별시 강남구 역삼동",
    createdAt: new Date("2026-04-10T00:00:00.000Z"),
    updatedAt: new Date("2026-04-10T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.jiyun,
    email: "jiyun@daepa.test",
    emailVerified: true,
    nickname: "지윤상점",
    image: null,
    address: "인천광역시 연수구 송도동",
    createdAt: new Date("2026-05-15T00:00:00.000Z"),
    updatedAt: new Date("2026-05-15T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.seojun,
    email: "seojun@daepa.test",
    emailVerified: true,
    nickname: "서준중고",
    image: null,
    address: "서울특별시 마포구 서교동",
    createdAt: new Date("2026-06-20T00:00:00.000Z"),
    updatedAt: new Date("2026-06-20T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.yuna,
    email: "yuna@daepa.test",
    emailVerified: true,
    nickname: "유나마켓",
    image: null,
    address: "경기도 수원시 영통구 광교동",
    createdAt: new Date("2026-07-25T00:00:00.000Z"),
    updatedAt: new Date("2026-07-25T00:00:00.000Z"),
    role: "일반회원",
  },
];

const accountIds = [
  "66c000000000000000000001",
  "66c000000000000000000002",
  "66c000000000000000000003",
  "66c000000000000000000004",
  "66c000000000000000000005",
];

export async function createCredentialAccounts(passwordHasher = hashPassword) {
  return Promise.all(
    users.map(async (user, index) => ({
      _id: accountIds[index],
      accountId: user._id,
      providerId: "credential",
      userId: user._id,
      password: await passwordHasher(DEMO_USER_PASSWORD),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  );
}

export const products = [
  {
    _id: "66e000000000000000000001",
    images: ["https://placehold.co/600x600?text=AirPods+Pro+2"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "충전 케이스와 이어팁을 모두 보관하고 있으며 정상 작동합니다.",
    initialPrice: 105000,
    minimumPrice: 70000,
    currentPrice: 94763,
    region: "서울특별시 강남구 역삼동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-01T01:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e000000000000000000002",
    images: ["https://placehold.co/600x600?text=iPhone+13"],
    name: "아이폰 13 128GB 미드나이트",
    category: "전자기기 > 스마트폰",
    info: "배터리 성능은 88%이며 액정과 카메라가 정상 작동합니다.",
    initialPrice: 760000,
    minimumPrice: 560000,
    currentPrice: 700340,
    region: "인천광역시 연수구 송도동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-08-25T03:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e000000000000000000003",
    images: ["https://placehold.co/600x600?text=Nintendo+Switch+OLED"],
    name: "닌텐도 스위치 OLED 화이트",
    category: "전자기기 > 게임기",
    info: "독과 정품 충전기를 포함하며 조이콘 쏠림이 없습니다.",
    initialPrice: 300000,
    minimumPrice: 210000,
    currentPrice: 285000,
    region: "서울특별시 마포구 서교동",
    condition: "최상",
    status: "판매중",
    createdAt: new Date("2026-08-29T06:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e000000000000000000004",
    images: ["https://placehold.co/600x600?text=IKEA+POANG"],
    name: "이케아 POANG 암체어",
    category: "가구 > 의자",
    info: "생활 사용감은 있지만 흔들림 없이 튼튼합니다.",
    initialPrice: 80000,
    minimumPrice: 40000,
    currentPrice: 76000,
    region: "경기도 성남시 분당구 정자동",
    condition: "중",
    status: "판매중",
    createdAt: new Date("2026-09-02T02:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e000000000000000000005",
    images: ["https://placehold.co/600x600?text=Atomic+Habits"],
    name: "아주 작은 습관의 힘",
    category: "도서 > 자기계발",
    info: "한 번 읽었고 필기나 접힌 페이지가 없습니다.",
    initialPrice: 18000,
    minimumPrice: 9000,
    currentPrice: 18000,
    region: "서울특별시 송파구 잠실동",
    condition: "최상",
    status: "판매중",
    createdAt: new Date("2026-09-08T20:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e000000000000000000006",
    images: ["https://placehold.co/600x600?text=AirPods+Sold+1"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "생활 흠집이 조금 있지만 배터리와 음질 상태가 좋습니다.",
    initialPrice: 92000,
    minimumPrice: 75000,
    currentPrice: 82000,
    region: "서울특별시 영등포구 당산동",
    condition: "상",
    status: "판매 완료",
    createdAt: new Date("2026-08-18T04:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e000000000000000000007",
    images: ["https://placehold.co/600x600?text=AirPods+Sold+2"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "정품 구성품을 모두 포함하며 케이스에 미세한 사용감이 있습니다.",
    initialPrice: 95000,
    minimumPrice: 78000,
    currentPrice: 84000,
    region: "경기도 수원시 영통구 광교동",
    condition: "상",
    status: "판매 완료",
    createdAt: new Date("2026-08-12T05:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e000000000000000000008",
    images: ["https://placehold.co/600x600?text=AirPods+Sold+3"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "사용 횟수가 적고 외관이 깨끗합니다.",
    initialPrice: 105000,
    minimumPrice: 82000,
    currentPrice: 90000,
    region: "서울특별시 용산구 한남동",
    condition: "최상",
    status: "판매 완료",
    createdAt: new Date("2026-08-05T08:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
];

export const watchlists = [
  { _id: "66f000000000000000000001", productId: "66e000000000000000000001", userId: DEMO_USER_IDS.jiyun, createdAt: new Date("2026-09-09T01:00:00.000Z") },
  { _id: "66f000000000000000000002", productId: "66e000000000000000000001", userId: DEMO_USER_IDS.seojun, createdAt: new Date("2026-09-08T09:00:00.000Z") },
  { _id: "66f000000000000000000003", productId: "66e000000000000000000002", userId: DEMO_USER_IDS.minsu, createdAt: new Date("2026-09-08T04:00:00.000Z") },
  { _id: "66f000000000000000000004", productId: "66e000000000000000000002", userId: DEMO_USER_IDS.seojun, createdAt: new Date("2026-09-07T03:00:00.000Z") },
  { _id: "66f000000000000000000005", productId: "66e000000000000000000003", userId: DEMO_USER_IDS.yuna, createdAt: new Date("2026-09-06T06:00:00.000Z") },
  { _id: "66f000000000000000000006", productId: "66e000000000000000000004", userId: DEMO_USER_IDS.jiyun, createdAt: new Date("2026-09-05T02:00:00.000Z") },
  { _id: "66f000000000000000000007", productId: "66e000000000000000000005", userId: DEMO_USER_IDS.minsu, createdAt: new Date("2026-09-09T00:30:00.000Z") },
];

export const transactions = [
  { _id: "670000000000000000000001", buyerId: DEMO_USER_IDS.jiyun, sellerId: DEMO_USER_IDS.seojun, productId: "66e000000000000000000006", price: 82000, createdAt: new Date("2026-09-04T07:00:00.000Z") },
  { _id: "670000000000000000000002", buyerId: DEMO_USER_IDS.minsu, sellerId: DEMO_USER_IDS.yuna, productId: "66e000000000000000000007", price: 84000, createdAt: new Date("2026-08-28T08:00:00.000Z") },
  { _id: "670000000000000000000003", buyerId: DEMO_USER_IDS.seojun, sellerId: DEMO_USER_IDS.minsu, productId: "66e000000000000000000008", price: 90000, createdAt: new Date("2026-08-20T09:00:00.000Z") },
];

export const priceChange = [
  { _id: "671000000000000000000001", productId: "66e000000000000000000001", changedAt: new Date("2026-09-01T01:00:00.000Z"), previousPrice: 105000, newPrice: 105000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000002", productId: "66e000000000000000000001", changedAt: new Date("2026-09-05T01:00:00.000Z"), previousPrice: 105000, newPrice: 99750, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000003", productId: "66e000000000000000000001", changedAt: new Date("2026-09-08T01:00:00.000Z"), previousPrice: 99750, newPrice: 94763, seq: 2, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000004", productId: "66e000000000000000000002", changedAt: new Date("2026-08-25T03:00:00.000Z"), previousPrice: 760000, newPrice: 760000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000005", productId: "66e000000000000000000002", changedAt: new Date("2026-09-01T03:00:00.000Z"), previousPrice: 760000, newPrice: 722000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000006", productId: "66e000000000000000000002", changedAt: new Date("2026-09-06T03:00:00.000Z"), previousPrice: 722000, newPrice: 700340, seq: 2, reason: "시장가격보다 비싸고 수요가 낮아 가격을 3% 인하", status: "DOWN" },
  { _id: "671000000000000000000007", productId: "66e000000000000000000003", changedAt: new Date("2026-08-29T06:00:00.000Z"), previousPrice: 300000, newPrice: 300000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000008", productId: "66e000000000000000000003", changedAt: new Date("2026-09-04T06:00:00.000Z"), previousPrice: 300000, newPrice: 285000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000009", productId: "66e000000000000000000004", changedAt: new Date("2026-09-02T02:00:00.000Z"), previousPrice: 80000, newPrice: 80000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000a", productId: "66e000000000000000000004", changedAt: new Date("2026-09-07T02:00:00.000Z"), previousPrice: 80000, newPrice: 76000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "67100000000000000000000b", productId: "66e000000000000000000005", changedAt: new Date("2026-09-08T20:00:00.000Z"), previousPrice: 18000, newPrice: 18000, seq: 0, reason: "등록 후 24시간이 지나지 않아 가격 유지", status: "KEEP" },
  { _id: "67100000000000000000000c", productId: "66e000000000000000000006", changedAt: new Date("2026-08-18T04:00:00.000Z"), previousPrice: 92000, newPrice: 92000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000d", productId: "66e000000000000000000006", changedAt: new Date("2026-09-04T07:00:00.000Z"), previousPrice: 92000, newPrice: 82000, seq: 1, reason: "82,000원에 거래가 성사되어 판매 완료", status: "DOWN" },
  { _id: "67100000000000000000000e", productId: "66e000000000000000000007", changedAt: new Date("2026-08-12T05:00:00.000Z"), previousPrice: 95000, newPrice: 95000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000f", productId: "66e000000000000000000007", changedAt: new Date("2026-08-28T08:00:00.000Z"), previousPrice: 95000, newPrice: 84000, seq: 1, reason: "84,000원에 거래가 성사되어 판매 완료", status: "DOWN" },
  { _id: "671000000000000000000010", productId: "66e000000000000000000008", changedAt: new Date("2026-08-05T08:00:00.000Z"), previousPrice: 105000, newPrice: 105000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000011", productId: "66e000000000000000000008", changedAt: new Date("2026-08-20T09:00:00.000Z"), previousPrice: 105000, newPrice: 90000, seq: 1, reason: "90,000원에 거래가 성사되어 판매 완료", status: "DOWN" },
];

export async function seedDatabase({
  uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
  databaseName = process.env.MONGODB_DB ?? "daepa_market",
} = {}) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("운영 환경에서는 개발용 시드를 실행할 수 없습니다.");
  }

  if (["admin", "config", "local"].includes(databaseName)) {
    throw new Error(`${databaseName} 데이터베이스에는 시드를 실행할 수 없습니다.`);
  }

  const accounts = await createCredentialAccounts();
  const collections = {
    users,
    account: accounts,
    products,
    watchlists,
    transactions,
    priceChange,
  };
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(databaseName);

    for (const collectionName of [
      "session",
      "verification",
      ...Object.keys(collections),
    ]) {
      await database.collection(collectionName).deleteMany({});
    }

    for (const [collectionName, documents] of Object.entries(collections)) {
      await database.collection(collectionName).insertMany(
        documents.map((document) => ({
          ...document,
          _id: new ObjectId(document._id),
          ...(collectionName === "account"
            ? { userId: new ObjectId(document.userId) }
            : {}),
        })),
      );
    }

    await database.collection("users").createIndex({ email: 1 }, { unique: true });
    await database.collection("account").createIndex({ userId: 1 });
    await database
      .collection("account")
      .createIndex({ providerId: 1, accountId: 1 }, { unique: true });
    await database
      .collection("watchlists")
      .createIndex({ userId: 1, productId: 1 }, { unique: true });
    await database.collection("products").createIndex({ status: 1, createdAt: -1 });
    await database.collection("products").createIndex({ category: 1, currentPrice: 1 });
    await database.collection("transactions").createIndex({ createdAt: -1 });
    await database
      .collection("priceChange")
      .createIndex({ productId: 1, seq: 1 }, { unique: true });

    console.log(`MongoDB ${databaseName} 데이터베이스에 초기 데이터를 저장했습니다.`);
    for (const [collectionName, documents] of Object.entries(collections)) {
      console.log(`${collectionName}: ${documents.length}건`);
    }
    console.log(`데모 계정 공통 비밀번호: ${DEMO_USER_PASSWORD}`);
  } finally {
    await client.close();
  }
}

const executedFile = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";

if (import.meta.url === executedFile) {
  await seedDatabase();
}
