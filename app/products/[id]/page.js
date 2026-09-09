import { notFound } from "next/navigation";
import { connection } from "next/server";
import Image from "next/image";
import { getProductById } from "@/lib/products";

export default async function ProductDetailPage({ params }) {
  await connection();

  const { id } = await params;
  const result = await getProductById(id);

  if (!result) notFound();

  const { product, seller, priceChanges, watchCount } = result;
  const totalDiscountRate = Math.round(
    (1 - product.currentPrice / product.initialPrice) * 100,
  );

  return (
    <main className="page-container page-section">
      <section className="product-detail">
        <div className="detail-image-panel">
          <Image src={product.images[0]} alt={product.name} width={600} height={600} priority />
        </div>
        <div className="detail-summary">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.info}</p>
          <dl className="product-facts">
            <div><dt>현재 가격</dt><dd>{product.currentPrice.toLocaleString()}원</dd></div>
            <div><dt>시작 가격</dt><dd>{product.initialPrice.toLocaleString()}원</dd></div>
            <div><dt>판매 최저가</dt><dd>{product.minimumPrice.toLocaleString()}원</dd></div>
            <div><dt>상품 상태</dt><dd>{product.condition}</dd></div>
            <div><dt>거래 지역</dt><dd>{product.region}</dd></div>
            <div><dt>관심</dt><dd>{watchCount}명</dd></div>
          </dl>
          <div className="seller-box">
            <strong>{seller?.nickname ?? "알 수 없는 판매자"}</strong>
            <span>{seller?.address}</span>
          </div>
          <button type="button" className="primary-button" disabled={product.status !== "판매중"}>
            {product.status === "판매중" ? "집어가기" : product.status}
          </button>
        </div>
      </section>

      <section className="price-history">
        <div className="section-header">
          <div>
            <p className="eyebrow">PRICE HISTORY</p>
            <h2>가격 변동</h2>
          </div>
          <span>최초 가격 대비 {totalDiscountRate}% 인하</span>
        </div>
        <div className="price-chart" aria-label="가격 변동 그래프">
          {priceChanges.map((change) => (
            <div className="price-point" key={change._id.toString()}>
              <span
                className="price-bar"
                style={{ height: `${Math.max(12, change.newPrice / product.initialPrice * 100)}%` }}
              />
              <strong>{change.newPrice.toLocaleString()}원</strong>
              <time>{change.changedAt.toLocaleDateString("ko-KR")}</time>
            </div>
          ))}
        </div>
        <ol className="price-reasons">
          {priceChanges.map((change) => (
            <li key={change._id.toString()}>
              <span className={`change-status ${change.status.toLowerCase()}`}>{change.status}</span>
              <div>
                <strong>{change.reason}</strong>
                <time>{change.changedAt.toLocaleString("ko-KR")}</time>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
