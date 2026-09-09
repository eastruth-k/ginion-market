import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { registerProduct } from "@/app/products/actions";
import { auth } from "@/lib/auth";

export default async function NewProductPage({ searchParams }) {
  await connection();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const { error } = await searchParams;

  return (
    <main className="page-container page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">SELL</p>
          <h1>상품 등록</h1>
        </div>
      </div>
      <form action={registerProduct} className="product-form">
        {error && <p className="form-error">{error}</p>}
        <label>상품명<input name="name" maxLength="100" required /></label>
        <label>카테고리<input name="category" placeholder="전자기기 > 이어폰" required /></label>
        <label className="wide-field">상품 설명<textarea name="info" rows="6" required /></label>
        <label className="wide-field">상품 이미지 URL<textarea name="images" rows="5" placeholder="한 줄에 하나씩, 최대 5개" required /></label>
        <label>거래 지역<input name="region" required /></label>
        <label>상품 상태
          <select name="condition" defaultValue="상">
            <option>최상</option><option>상</option><option>중</option><option>하</option>
          </select>
        </label>
        <label>판매 시작 가격<input name="initialPrice" type="number" min="1" step="1" required /></label>
        <label>판매 최저 가격<input name="minimumPrice" type="number" min="1" step="1" required /></label>
        <p className="form-help wide-field">등록 후 가격은 24시간 동안 유지되며, 이후 실제 거래가와 반응 데이터를 기준으로 최저 가격 범위 안에서 평가됩니다.</p>
        <button type="submit" className="wide-field">상품 등록</button>
      </form>
    </main>
  );
}
