

import { connection } from "next/server";

export default async function TermsPage() {
  await connection();

  return (
    <main>
      <h1>이용약관</h1>
      <p>이용약관 페이지입니다.</p>
    </main>
  );
}
