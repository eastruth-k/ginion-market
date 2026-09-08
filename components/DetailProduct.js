import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">

      <Link href={`/products/${product.id}`}>

        {/* 상품 이미지 */}
        <div className="product-image">

          <span className="sale-status">
            🔪 썰림 중
          </span>

          <span className="heart">
            ♡
          </span>

          <span className="product-emoji">
            {product.imagePlaceholder}
          </span>

        </div>

        {/* 상품 정보 */}
        <div className="product-info">

          <span className="category">
            {product.category}
          </span>

          <h3>
            {product.title}
          </h3>

          <div className="price">
            <strong>
              {product.currentPrice.toLocaleString()}원
            </strong>

            <del>
              {product.initialPrice.toLocaleString()}원
            </del>
          </div>

          <div className="next-decrease">
            🕐 다음 썰림{" "}
            <strong>
              {product.nextAdjustmentAt.toLocaleString("ko-KR", {
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </strong>
          </div>

          <div className="next-price">
            <span>최저가</span>
            <strong>
              {product.minimumPrice.toLocaleString()}원
            </strong>
          </div>

        </div>

      </Link>

    </article>
  );
}
