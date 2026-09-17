import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { getMyPageData } from "@/lib/users";

function ActivityProductItem({ product, badge, price, date }) {
  return (
    <li>
      <Link href={`/products/${product._id.toString()}`}>
        <Image
          src={product.images[0]}
          alt={product.name}
          width={110}
          height={110}
          unoptimized
        />
        <div>
          <span>{badge}</span>
          <strong>{product.name}</strong>
          <small>{product.category}</small>
          <p>
            <b>{price.toLocaleString()}원</b>
            <time>{date.toLocaleDateString("ko-KR")}</time>
          </p>
        </div>
        <span aria-hidden="true">›</span>
      </Link>
    </li>
  );
}

function EmptyActivity({ children }) {
  return <p className="mypage-empty">{children}</p>;
}

export default async function MyPage() {
  await connection();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { activity, sellingProducts, purchases, watchlists } =
    await getMyPageData(session.user.id);

  return (
    <main className="mypage-page">
      <div className="mypage-heading">
        <p className="eyebrow">MY DAEPA</p>
        <h1>{session.user.name}님의 활동</h1>
        <p>판매와 구매, 관심상품 내역을 한곳에서 확인하세요.</p>
      </div>

      <nav className="activity-grid" aria-label="MYPAGE 내역 바로가기">
        <Link href="#selling">
          <span>판매 관리</span>
          <strong>{activity.sellingCount}</strong>
          <p>판매중·예약중 상품</p>
        </Link>
        <Link href="#purchases">
          <span>구매 내역</span>
          <strong>{activity.purchaseCount}</strong>
          <p>거래 완료 상품</p>
        </Link>
        <Link href="#watchlists">
          <span>관심상품</span>
          <strong>{activity.watchlistCount}</strong>
          <p>관심상품으로 저장한 상품</p>
        </Link>
      </nav>

      <section className="mypage-activity-section" id="selling">
        <div className="mypage-section-heading">
          <div>
            <p className="eyebrow">SELLING</p>
            <h2>판매 관리</h2>
          </div>
          <Link href="/products/new">상품 등록하기</Link>
        </div>
        {sellingProducts.length > 0 ? (
          <ul className="mypage-product-list">
            {sellingProducts.map((product) => (
              <ActivityProductItem
                key={product._id.toString()}
                product={product}
                badge={product.status}
                price={product.currentPrice}
                date={product.createdAt}
              />
            ))}
          </ul>
        ) : (
          <EmptyActivity>등록한 상품이 없습니다.</EmptyActivity>
        )}
      </section>

      <section className="mypage-activity-section" id="purchases">
        <div className="mypage-section-heading">
          <div>
            <p className="eyebrow">PURCHASES</p>
            <h2>구매 내역</h2>
          </div>
          <Link href="/products">상품 둘러보기</Link>
        </div>
        {purchases.length > 0 ? (
          <ul className="mypage-product-list">
            {purchases.map((purchase) => (
              <ActivityProductItem
                key={purchase._id.toString()}
                product={purchase.product}
                badge="구매 완료"
                price={purchase.price}
                date={purchase.createdAt}
              />
            ))}
          </ul>
        ) : (
          <EmptyActivity>구매한 상품이 없습니다.</EmptyActivity>
        )}
      </section>

      <section className="mypage-activity-section" id="watchlists">
        <div className="mypage-section-heading">
          <div>
            <p className="eyebrow">WATCHLIST</p>
            <h2>관심상품</h2>
          </div>
          <Link href="/my-board">관심상품 전체 보기</Link>
        </div>
        {watchlists.length > 0 ? (
          <ul className="mypage-product-list">
            {watchlists.map((watchlist) => (
              <ActivityProductItem
                key={watchlist._id.toString()}
                product={watchlist.product}
                badge={watchlist.product.status}
                price={watchlist.product.currentPrice}
                date={watchlist.createdAt}
              />
            ))}
          </ul>
        ) : (
          <EmptyActivity>관심상품을 추가해보세요.</EmptyActivity>
        )}
      </section>
    </main>
  );
}
