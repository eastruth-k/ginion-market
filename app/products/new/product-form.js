"use client";

import { useActionState } from "react";
import { registerProduct } from "@/app/products/actions";

const initialState = { error: "", values: {}, revision: 0 };

export default function ProductForm() {
  const [state, formAction, pending] = useActionState(
    registerProduct,
    initialState,
  );
  const values = state.values ?? initialState.values;

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
      <label className="wide-field">
        상품 이미지 URL
        <textarea
          name="images"
          defaultValue={values.images}
          rows="5"
          placeholder="한 줄에 하나씩, 최대 5개"
          required
        />
      </label>
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
          defaultValue={values.initialPrice}
          type="number"
          min="1"
          step="1"
          required
        />
      </label>
      <label>
        판매 최저 가격
        <input
          name="minimumPrice"
          defaultValue={values.minimumPrice}
          type="number"
          min="1"
          step="1"
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
