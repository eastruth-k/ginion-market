import { connection } from "next/server";

export default async function ContactPage() {
  await connection();

  return (
    <main>
      <h1>문의하기</h1>
      <p>문의하기 페이지입니다.</p>
    </main>
  );
}
