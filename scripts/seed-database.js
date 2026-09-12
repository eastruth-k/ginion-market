import { MongoClient, ObjectId } from "mongodb";
import {
  priceChange,
  products,
  transactions,
  users,
  watchlists,
} from "./seeds.js";

// Teacher: AGENTS.md는 초기화·시드를 scripts/seeds.js에서만 관리하도록 합니다. 현재는 데이터와 실행기가 분리되어 있으므로 npm run seed의 진입점을 추적하고, 한 파일로 합치는 안의 장단점을 비교해 보기.
const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DB ?? "daepa_market";

if (process.env.NODE_ENV === "production") {
  throw new Error("운영 환경에서는 개발용 시드를 실행할 수 없습니다.");
}

if (["admin", "config", "local"].includes(databaseName)) {
  throw new Error(`${databaseName} 데이터베이스에는 시드를 실행할 수 없습니다.`);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const database = client.db(databaseName);

  const collections = {
    products,
    watchlists,
    transactions,
    priceChange,
    users,
  };

  for (const [collectionName, documents] of Object.entries(collections)) {
    const collection = database.collection(collectionName);
    await collection.deleteMany({});
    await collection.insertMany(
      documents.map((document) => ({
        ...document,
        _id: new ObjectId(document._id),
      })),
    );
  }

  await database.collection("users").createIndex({ email: 1 }, { unique: true });
  await database
    .collection("watchlists")
    .createIndex({ userId: 1, productId: 1 }, { unique: true });
  await database.collection("products").createIndex({ status: 1, createdAt: -1 });
  await database.collection("products").createIndex({ category: 1, currentPrice: 1 });
  await database.collection("transactions").createIndex({ createdAt: -1 });
  await database.collection("priceChange").createIndex({ productId: 1, seq: 1 }, { unique: true });

  console.log(`MongoDB ${databaseName} 데이터베이스에 초기 데이터를 저장했습니다.`);
  for (const [collectionName, documents] of Object.entries(collections)) {
    console.log(`${collectionName}: ${documents.length}건`);
  }
} finally {
  await client.close();
}
