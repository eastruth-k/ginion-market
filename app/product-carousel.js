"use client";

import { useRef } from "react";

export default function ProductCarousel({ children, itemCount, title }) {
  const carouselRef = useRef(null);
  const hasMultiplePages = itemCount > 4;

  function moveCarousel(direction) {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      left: direction * carousel.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <div className="home-product-carousel" aria-label={`${title} 슬라이더`}>
      <div className="home-product-carousel-track" ref={carouselRef}>
        {children}
      </div>

      {hasMultiplePages && (
        <div className="home-product-carousel-controls">
          <button
            type="button"
            onClick={() => moveCarousel(-1)}
            aria-label={`${title} 이전 상품 보기`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => moveCarousel(1)}
            aria-label={`${title} 다음 상품 보기`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
