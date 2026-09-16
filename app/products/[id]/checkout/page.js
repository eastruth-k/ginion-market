import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import CheckoutForm from "@/app/products/[id]/checkout/checkout-form";
import { auth } from "@/lib/auth";
import { getProductById } from "@/lib/products";

export default async function ProductCheckoutPage({ params }) {
  await connection();

  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const result = await getProductById(id);
  if (!result) notFound();

  const { product } = result;
  const isOwnProduct = product.sellerId === session.user.id;
  const canPurchase = product.status === "판매중" && !isOwnProduct;

  return (
    <main className="checkout-page">
      <div className="checkout-page-heading">
        <div>
          <p className="eyebrow">MOCK CHECKOUT</p>
          <h1>결제하기</h1>
          <p>실제 결제가 발생하지 않는 결제 화면 체험용 페이지입니다.</p>
        </div>
        <Link href={`/products/${id}`}>상품으로 돌아가기</Link>
      </div>

      {canPurchase ? (
        <div className="checkout-layout">
          <section className="checkout-summary">
            <h2>주문 상품</h2>
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
                <small>{product.region}</small>
              </div>
            </div>
            <dl>
              <div>
                <dt>상품 금액</dt>
                <dd>{product.currentPrice.toLocaleString()}원</dd>
              </div>
              <div>
                <dt>배송비</dt>
                <dd>0원</dd>
              </div>
              <div className="checkout-total">
                <dt>결제 예정 금액</dt>
                <dd>{product.currentPrice.toLocaleString()}원</dd>
              </div>
            </dl>
          </section>

          <CheckoutForm
            productId={id}
            buyerName={session.user.name ?? ""}
            address={session.user.address ?? ""}
          />
        </div>
      ) : (
        <section className="checkout-unavailable">
          <h2>
            {isOwnProduct
              ? "본인이 등록한 상품입니다"
              : "현재 구매할 수 없는 상품입니다"}
          </h2>
          <p>
            {isOwnProduct
              ? "본인이 판매 중인 상품은 구매할 수 없습니다."
              : "상품 상태가 변경되어 목업 결제를 진행할 수 없습니다."}
          </p>
          <Link className="primary-button" href={`/products/${id}`}>
            상품으로 돌아가기
          </Link>
        </section>
      )}
    </main>
  );
}
