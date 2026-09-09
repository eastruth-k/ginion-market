import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { mongoClient, mongoDatabase } from "@/lib/mongodb";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "development-only-daepa-market-secret-change-before-production",
  database: mongodbAdapter(mongoDatabase, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    modelName: "users",
    fields: {
      name: "nickname",
      image: "profileImage",
    },
    additionalFields: {
      address: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "일반회원",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
});
