import Link from "next/link";
import Image from "next/image";

export default function DetailProduct({ product }) {
  const productId = product._id.toString();
  const discountRate = Math.round(
    ((product.initialPrice - product.currentPrice) / product.initialPrice) * 100,
  );
  const latestChange = product.latestPriceChange;
  const nextEvaluationAt = latestChange?.changedAt
    ? new Date(latestChange.changedAt.getTime() + 24 * 60 * 60 * 1000)
    : null;

  return (
    <article className="product-card">
      <Link href={`/products/${productId}`}>
        <div className="product-image-wrap">
          <Image
            className="product-image"
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={600}
          />
          <span className="sale-status">{product.status}</span>
          {product.watchCount > 0 && (
            <span className="watch-count">♡ {product.watchCount}</span>
          )}
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-region">{product.region}</p>
          <div className="product-price-row">
            <strong className="product-price">
              {product.currentPrice.toLocaleString()}원
            </strong>
            {discountRate > 0 && <span className="discount-rate">-{discountRate}%</span>}
          </div>
          {product.currentPrice !== product.initialPrice && (
            <del className="product-before-price">
              {product.initialPrice.toLocaleString()}원
            </del>
          )}
          {nextEvaluationAt && (
            <p className="next-evaluation">
              다음 가격 평가 {nextEvaluationAt.toLocaleString("ko-KR", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
