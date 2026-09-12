import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { mongoClient, mongoDatabase } from "@/lib/mongodb";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET 환경변수를 설정해주세요.");
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(mongoDatabase, {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    // Teacher: Better Auth의 user 모델을 users 컬렉션에 저장하고 name을 nickname으로 연결합니다. session.user.name과 DB의 nickname이 같은 의미로 쓰이는 경로를 찾고, 업무 외래키 문자열 규칙과 인증 컬렉션 예외를 구분해 보기.
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
