"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageSlider({ images, productName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  function showPreviousImage() {
    setCurrentIndex(
      (previousIndex) =>
        (previousIndex - 1 + images.length) % images.length,
    );
  }

  function showNextImage() {
    setCurrentIndex((previousIndex) => (previousIndex + 1) % images.length);
  }

  return (
    <div className="product-image-slider">
      <div className="product-slider-main">
        <Image
          className="product-slider-image"
          src={images[currentIndex]}
          alt={`${productName} 이미지 ${currentIndex + 1}`}
          width={600}
          height={600}
          priority
          unoptimized
        />
        {hasMultipleImages && (
          <>
            <button
              className="product-slider-control previous"
              type="button"
              onClick={showPreviousImage}
              aria-label="이전 상품 이미지"
            >
              ‹
            </button>
            <button
              className="product-slider-control next"
              type="button"
              onClick={showNextImage}
              aria-label="다음 상품 이미지"
            >
              ›
            </button>
            <span className="product-slider-count" aria-live="polite">
              {currentIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="product-slider-thumbnails" aria-label="상품 이미지 목록">
          {images.map((image, index) => (
            <button
              className={index === currentIndex ? "selected" : ""}
              type="button"
              key={image}
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 상품 이미지 보기`}
              aria-pressed={index === currentIndex}
            >
              <Image
                src={image}
                alt=""
                width={90}
                height={90}
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
