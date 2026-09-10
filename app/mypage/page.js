import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { getUserActivity } from "@/lib/users";

export default async function MyPage() {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const activity = await getUserActivity(session.user.id);

  return (
    <>
      <main>
        <div><div><p>MY DAEPA</p><h1>{session.user.name}님의 활동</h1></div></div>
        <section>
          <article><span>판매 관리</span><strong>{activity.sellingCount}</strong><p>판매중·예약중 상품</p></article>
          <article><span>구매 내역</span><strong>{activity.purchaseCount}</strong><p>거래 완료 상품</p></article>
          <article><span>관심 상품</span><strong>{activity.watchlistCount}</strong><p>내 도마에 담은 상품</p></article>
        </section>
      </main>
    </>
  );
}
