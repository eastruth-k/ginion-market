import { connection } from "next/server";

export default async function PrivacyPage() {
  await connection();

  return (
    <main>
      <h1>개인정보처리방침</h1>
      <p>개인정보처리방침 페이지입니다.</p>
    </main>
  );
}
