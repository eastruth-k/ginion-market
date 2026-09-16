"use client";

import Link from "next/link";
import { useActionState } from "react";
import { completeMockCheckout } from "@/app/products/[id]/checkout/actions";

const initialState = {
  error: "",
  values: {},
  completed: false,
  mockOrderNumber: "",
  revision: 0,
};

export default function CheckoutForm({ productId, buyerName, address }) {
  const checkoutAction = completeMockCheckout.bind(null, productId);
  const [state, formAction, pending] = useActionState(
    checkoutAction,
    initialState,
  );
  const values = state.values ?? initialState.values;

  if (state.completed) {
    return (
      <section className="mock-payment-complete" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">MOCK PAYMENT COMPLETE</p>
        <h2>목업 결제가 완료되었습니다</h2>
        <p>
          실제 금융 결제는 발생하지 않았습니다. 구매 내역은 MYPAGE에
          기록되었으며 입력한 배송·결제 정보는 저장되지 않았습니다.
        </p>
        <dl>
          <div>
            <dt>목업 주문번호</dt>
            <dd>{state.mockOrderNumber}</dd>
          </div>
        </dl>
        <div className="mock-payment-links">
          <Link href={`/products/${productId}`}>상품으로 돌아가기</Link>
          <Link className="primary-button" href="/products">
            다른 상품 보기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form
      key={state.revision}
      action={formAction}
      className="checkout-form"
    >
      <div className="checkout-form-heading">
        <p className="eyebrow">BUYER INFORMATION</p>
        <h2>구매자 정보</h2>
      </div>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <label>
        구매자 이름
        <input
          name="buyerName"
          defaultValue={values.buyerName ?? buyerName}
          maxLength="50"
          required
        />
      </label>
      <label>
        연락처
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          defaultValue={values.phone}
          placeholder="010-1234-5678"
          required
        />
      </label>
      <label>
        배송지
        <input
          name="address"
          defaultValue={values.address ?? address}
          maxLength="200"
          required
        />
      </label>
      <label>
        배송 요청사항
        <input
          name="deliveryRequest"
          defaultValue={values.deliveryRequest}
          maxLength="100"
          placeholder="문 앞에 놓아주세요."
        />
      </label>

      <fieldset className="payment-methods">
        <legend>결제수단</legend>
        <label>
          <input
            name="paymentMethod"
            type="radio"
            value="card"
            defaultChecked={values.paymentMethod === "card"}
            required
          />
          신용·체크카드
        </label>
        <label>
          <input
            name="paymentMethod"
            type="radio"
            value="bank"
            defaultChecked={values.paymentMethod === "bank"}
          />
          계좌이체
        </label>
        <label>
          <input
            name="paymentMethod"
            type="radio"
            value="easy"
            defaultChecked={values.paymentMethod === "easy"}
          />
          간편결제
        </label>
      </fieldset>

      <div className="mock-payment-notice">
        <strong>테스트 결제 안내</strong>
        <p>
          실제 카드번호나 계좌정보는 입력받지 않습니다. 금융 결제는 발생하지
          않으며, 완료된 목업 거래만 구매 내역에 기록됩니다. 입력한 배송·결제
          정보는 저장되지 않습니다.
        </p>
        <label>
          <input
            name="agreement"
            type="checkbox"
            value="yes"
            defaultChecked={values.agreement === true}
            required
          />
          위 내용을 확인했습니다.
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "목업 결제 확인 중..." : "목업 결제하기"}
      </button>
    </form>
  );
}
