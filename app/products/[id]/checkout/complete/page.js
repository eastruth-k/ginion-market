import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { getPurchaseTransaction } from "@/lib/transactions";

export default async function MockCheckoutCompletePage({ params, searchParams }) {
  await connection();

  const { id } = await params;
  const { transactionId } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const purchase = await getPurchaseTransaction(
    transactionId,
    session.user.id,
    id,
  );

  if (!purchase) notFound();

  const { transaction, product } = purchase;
  const mockOrderNumber = `MOCK-${transaction._id.toString().slice(-8).toUpperCase()}`;

  return (
    <main className="checkout-page">
      <section className="mock-payment-complete" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">MOCK PAYMENT COMPLETE</p>
        <h1>목업 결제가 완료되었습니다</h1>
        <p>실제 금융 결제는 발생하지 않았습니다.</p>
        <p>
          구매 내역은 MYPAGE에 기록되었으며 입력한 배송·결제 정보는 저장되지
          않았습니다.
        </p>
        <div className="checkout-product">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={150}
            height={150}
            unoptimized
          />
          <div>
            <span>{product.category}</span>
            <strong>{product.name}</strong>
            <small>{transaction.price.toLocaleString()}원</small>
          </div>
        </div>

        <dl>
          <div>
            <dt>목업 주문번호</dt>
            <dd>{mockOrderNumber}</dd>
          </div>
          <div>
            <dt>결제 금액</dt>
            <dd>{transaction.price.toLocaleString()}원</dd>
          </div>
          <div>
            <dt>구매 일시</dt>
            <dd>{transaction.createdAt.toLocaleString("ko-KR")}</dd>
          </div>
        </dl>

        <div className="mock-payment-links">
          <Link href="/mypage#purchases">구매 내역 보기</Link>
          <Link className="primary-button" href="/products">
            다른 상품 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
