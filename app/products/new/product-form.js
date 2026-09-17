"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { registerProduct } from "@/app/products/actions";
import { validateSelectedProductImageSize } from "@/app/products/product-validation";

const initialState = { error: "", values: {}, revision: 0 };
const maximumImageCount = 5;

function formatPrice(value) {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function ImageUpload() {
  const inputRef = useRef(null);
  const previewUrlsRef = useRef([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function updateInputFiles(images) {
    const dataTransfer = new DataTransfer();
    images.forEach((image) => dataTransfer.items.add(image.file));

    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
  }

  function handleImagesChange(event) {
    const newFiles = Array.from(event.target.files ?? []);
    const selectedFileKeys = new Set(
      selectedImages.map(
        (image) =>
          `${image.file.name}-${image.file.size}-${image.file.lastModified}`,
      ),
    );
    const uniqueNewFiles = newFiles.filter((file) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      return !selectedFileKeys.has(fileKey);
    });

    if (selectedImages.length + uniqueNewFiles.length > maximumImageCount) {
      updateInputFiles(selectedImages);
      setImageError("상품 이미지는 최대 5개까지 첨부할 수 있습니다.");
      return;
    }

    const imageSizeError = validateSelectedProductImageSize(uniqueNewFiles);
    if (imageSizeError) {
      updateInputFiles(selectedImages);
      setImageError(imageSizeError);
      return;
    }

    const addedImages = uniqueNewFiles.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.push(url);

      return {
        file,
        id: `${file.name}-${file.size}-${file.lastModified}`,
        url,
      };
    });
    const nextImages = [...selectedImages, ...addedImages];

    setImageError("");
    setSelectedImages(nextImages);
    updateInputFiles(nextImages);
  }

  function removeImage(imageId) {
    const removedImage = selectedImages.find((image) => image.id === imageId);
    const nextImages = selectedImages.filter((image) => image.id !== imageId);

    if (removedImage) {
      URL.revokeObjectURL(removedImage.url);
      previewUrlsRef.current = previewUrlsRef.current.filter(
        (url) => url !== removedImage.url,
      );
    }

    setImageError("");
    setSelectedImages(nextImages);
    updateInputFiles(nextImages);
  }

  return (
    <div className="wide-field image-upload-field">
      <label htmlFor="product-images">상품 이미지</label>
      <input
        ref={inputRef}
        id="product-images"
        name="images"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleImagesChange}
        required
      />
      <small>
        JPG, PNG, WEBP, GIF 파일을 한 장당 5MB 이하로 최대 5개까지
        첨부해주세요.
      </small>
      {imageError && (
        <p className="image-upload-error" role="alert">
          {imageError}
        </p>
      )}
      {selectedImages.length > 0 && (
        <div className="image-preview-list" aria-label="선택한 상품 이미지">
          {selectedImages.map((image, index) => (
            <figure key={image.id}>
              <Image
                src={image.url}
                alt={`${image.file.name} 미리보기`}
                width={160}
                height={160}
                unoptimized
              />
              <button
                className="image-preview-remove"
                type="button"
                onClick={() => removeImage(image.id)}
                aria-label={`${image.file.name} 삭제`}
              >
                ×
              </button>
              <figcaption>
                {index + 1}. {image.file.name}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductForm() {
  const [state, formAction, pending] = useActionState(
    registerProduct,
    initialState,
  );
  const values = state.values ?? initialState.values;
  const [initialPrice, setInitialPrice] = useState(
    formatPrice(values.initialPrice ?? ""),
  );
  const [minimumPrice, setMinimumPrice] = useState(
    formatPrice(values.minimumPrice ?? ""),
  );

  return (
    <form key={state.revision} action={formAction} className="product-form">
      {state.error && (
        <p className="form-error wide-field" role="alert">
          {state.error}
        </p>
      )}

      <label>
        상품명
        <input
          name="name"
          defaultValue={values.name}
          maxLength="100"
          required
        />
      </label>
      <label>
        카테고리
        <input
          name="category"
          defaultValue={values.category}
          placeholder="전자기기 > 이어폰"
          required
        />
      </label>
      <label className="wide-field">
        상품 설명
        <textarea name="info" defaultValue={values.info} rows="6" required />
      </label>
      <ImageUpload />
      <label>
        거래 지역
        <input name="region" defaultValue={values.region} required />
      </label>
      <label>
        상품 상태
        <select name="condition" defaultValue={values.condition || "상"}>
          <option>최상</option>
          <option>상</option>
          <option>중</option>
          <option>하</option>
        </select>
      </label>
      <label>
        판매 시작 가격
        <input
          name="initialPrice"
          type="text"
          inputMode="numeric"
          pattern="[0-9,]+"
          value={initialPrice}
          onChange={(event) => setInitialPrice(formatPrice(event.target.value))}
          required
        />
      </label>
      <label>
        판매 최저 가격
        <input
          name="minimumPrice"
          type="text"
          inputMode="numeric"
          pattern="[0-9,]+"
          value={minimumPrice}
          onChange={(event) => setMinimumPrice(formatPrice(event.target.value))}
          required
        />
      </label>
      <p className="form-help wide-field">
        등록 후 가격은 24시간 동안 유지되며, 이후 실제 거래가와 반응 데이터를
        기준으로 최저 가격 범위 안에서 평가됩니다.
      </p>
      <button className="wide-field" type="submit" disabled={pending}>
        {pending ? "상품 등록 중..." : "상품 등록"}
      </button>
    </form>
  );
}
