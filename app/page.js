import Link from "next/link";
import Header from "@/components/Header";
import DetailProduct from "@/components/DetailProduct";
import { products } from "@/scripts/seeds";

export default function Home() {
  const popularProducts = products.slice(0, 4);
  const soonProducts = products.slice(4, 8);

  return (
    <>
      <Header />

      <main>

        {/* =========================
            메인 배너
        ========================= */}
        <section className="hero">

          <div className="hero-content">

            <p className="hero-label">
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
              새로운 중고거래를 시작해보세요.
            </p>

            <Link href="/products">
              지금 상품 보러가기 →
            </Link>

          </div>

          <div className="hero-image">
            <div>
              <span>🥬</span>
              <strong>🔪</strong>
            </div>
          </div>

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


          <div className="product-grid">

            {popularProducts.map((product) => (
              <DetailProduct
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </section>


        {/* =========================
            곧 썰리는 상품
        ========================= */}
        <section className="product-section soon-section">

          <div className="section-header">

            <div>
              <h2>🔪 곧 썰리는 상품</h2>
              <p>
                조금만 기다리면 가격이 내려가요.
              </p>
            </div>

            <Link href="/products">
              전체보기 →
            </Link>

          </div>


          <div className="product-grid">

            {soonProducts.map((product) => (
              <DetailProduct
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </section>


        {/* =========================
            서비스 소개
        ========================= */}
        <section className="features">

          <div className="section-title">
            <p>WHY DAEPA MARKET?</p>
            <h2>대파마켓이 특별한 이유</h2>
          </div>


          <div className="feature-grid">

            <article>
              <span>🔪</span>
              <h3>자동 가격 인하</h3>
              <p>
                설정한 주기에 따라
                가격이 자동으로 내려가요.
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
              <h3>내 도마</h3>
              <p>
                관심 상품을 도마에 올려
                가격 변화를 지켜보세요.
              </p>
            </article>


            <article>
              <span>🛒</span>
              <h3>집어가기</h3>
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
      <footer>

        <div className="footer-inner">

          <div>
            <strong>🥬 대파마켓</strong>

            <p>
              가격은 기다리면 썰립니다. 🔪
            </p>
          </div>

          <nav>
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/contact">고객센터</Link>
          </nav>

        </div>

      </footer>
    </>
  );
}