import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import DetailProduct from "@/components/DetailProduct";
import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { getWatchlistProducts } from "@/lib/watchlists";

export default async function MyBoardPage() {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const products = await getWatchlistProducts(session.user.id);

  return (
    <>
      <Header />
      <main className="page-container page-section">
        <div className="page-heading"><div><p className="eyebrow">WATCHLIST</p><h1>내 도마</h1></div><strong>{products.length}개</strong></div>
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => <DetailProduct key={product._id.toString()} product={product} />)}
          </div>
        ) : <p className="empty-state">관심 상품을 내 도마에 담아보세요.</p>}
      </main>
    </>
  );
}
