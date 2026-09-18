import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import DetailProduct from "@/components/DetailProduct";
import ProductCarousel from "@/app/product-carousel";
import PriceAdjustmentButton from "@/app/price-adjustment-button";
import { getPopularProducts, getRecentProducts } from "@/lib/products";

export default async function Home() {
  await connection();

  const [popularProducts, recentProducts] = await Promise.all([
    getPopularProducts(12),
    getRecentProducts(12),
  ]);

  return (
    <>

      <main>
        <section className="hero">
          <Image
              className="hero-banner-background"
              src="/images/banners/daepa-hero-banner-1280.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1280px) calc(100vw - 40px), 1280px"
            />

          <div className="hero-content">
            <p className="eyebrow">
              🔪 대파마켓
            </p>

            <h1>
              흥정 대신,
              <br />
              <span>가격이 썰립니다.</span>
            </h1>

            <p>
              시간이 지날수록 가격이 내려가는
              <br />
              새로운 중고거래를{" "}
              시작해보세요.
            </p>

            <Link href="/products">
              🥬🔪지금 상품 보러가기 →
            </Link>
          </div>

          <PriceAdjustmentButton />
        </section>


        {/* =========================
            인기 상품
        ========================= */}
        <section className="product-section">

          <div className="section-header">

            <div>
              <h2>🔥 지금 인기 있는 상품</h2>
              <p>
                많은 사람들이 관심을 갖고 있는 상품이에요.
              </p>
            </div>

            <Link href="/products">
              전체보기 →
            </Link>

          </div>


          <ProductCarousel
            itemCount={popularProducts.length}
            title="인기 상품"
          >

            {popularProducts.map((product) => (
              <DetailProduct
                key={product._id.toString()}
                product={product}
              />
            ))}

          </ProductCarousel>

        </section>


        {/* =========================
            최근 등록상품
        ========================= */}
        <section className="product-section">

          <div className="section-header">

            <div>
              <h2>🆕 최근 등록 상품</h2>
              <p>
                새로 올라온 상품을 먼저 만나보세요.
              </p>
            </div>

            <Link href="/products">
              전체보기 →
            </Link>

          </div>


          <ProductCarousel
            itemCount={recentProducts.length}
            title="최근 등록 상품"
          >

            {recentProducts.map((product) => (
              <DetailProduct
                key={product._id.toString()}
                product={product}
              />
            ))}

          </ProductCarousel>

        </section>


        {/* =========================
            서비스 소개
        ========================= */}
        <section>

          <div>
            <p className="eyebrow">WHY DAEPA MARKET?</p>
            <h2>대파마켓이 특별한 이유</h2>
          </div>


          <div className="introduce">
            <article>
              <span>🔪</span>
              <h3>자동 가격 조정</h3>
              <p>
                새 관심 수에 따라
                가격이 자동으로 바뀌어요.
              </p>
            </article>
            <article>
              <span>🎯</span>
              <h3>목표가 알림</h3>
              <p>
                원하는 가격을 설정하고
                가격 변화를 지켜볼 수 있어요.
              </p>
            </article>
            <article>
              <span>🥬</span>
              <h3>관심상품</h3>
              <p>
                관심 있는 상품을 저장하고
                가격 변화를 지켜보세요.
              </p>
            </article>
            <article>
              <span>🛒</span>
              <h3>구매하기</h3>
              <p>
                원하는 가격이 되면
                바로 구매할 수 있어요.
              </p>
            </article>
          </div>
        </section>

      </main>


      {/* =========================
          Footer
      ========================= */}
      <footer className="site-footer">

        <div className="footer-inner">

          <div className="footer-brand">
            <strong><span aria-hidden="true">🥬</span> 대파마켓</strong>

            <p>
              가격은 기다리면 썰립니다. 🔪
            </p>
          </div>

          <nav aria-label="푸터 메뉴">
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/contact">고객센터</Link>
          </nav>

        </div>

      </footer>
    </>
  );
}
