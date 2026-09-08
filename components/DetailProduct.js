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
            {product.image}
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
              {product.price.toLocaleString()}원
            </strong>

            <del>
              {product.originalPrice.toLocaleString()}원
            </del>
          </div>

          <div className="next-decrease">
            🕐 다음 썰림{" "}
            <strong>{product.nextDecrease}</strong>
          </div>

          <div className="next-price">
            <span>다음가</span>
            <strong>
              {product.nextPrice.toLocaleString()}원
            </strong>
          </div>

        </div>

      </Link>

    </article>
  );
}