import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DB ?? "daepa_market";

const globalMongo = globalThis;

if (!globalMongo.daepaMongoClient) {
  globalMongo.daepaMongoClient = new MongoClient(uri);
}

export const mongoClient = globalMongo.daepaMongoClient;
export const mongoDatabase = mongoClient.db(databaseName);

export async function getDatabase() {
  if (!globalMongo.daepaMongoClientPromise) {
    globalMongo.daepaMongoClientPromise = mongoClient.connect();
  }

  await globalMongo.daepaMongoClientPromise;
  return mongoDatabase;
}
