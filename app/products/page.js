import { connection } from "next/server";
import DetailProduct from "@/components/DetailProduct";
import { getProductCategories, getProducts } from "@/lib/products";

export default async function ProductsPage({ searchParams }) {
  await connection();

  const filters = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(filters),
    getProductCategories(),
  ]);

  return (
    <main>
      <div>
        <div>
          <p>상품 찾기</p>
          <h1>가격이 썰리고 있는 상품</h1>
        </div>
        <strong>{products.length}개</strong>
      </div>

      {/* // Teacher: 문자열 action은 이동할 URL이고 method를 생략한 이 폼은 GET입니다. 함수 action={registerProduct}와 비교하며 입력값 → searchParams → DB 조건으로 이어지는 흐름을 확인해 보기. */}
      <form action="/products">
        <label>
          검색
          <input name="q" type="search" defaultValue={filters.q ?? ""} />
        </label>
        <label>
          카테고리
          <select name="category" defaultValue={filters.category ?? ""}>
            <option value="">전체</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          지역
          <input name="region" defaultValue={filters.region ?? ""} />
        </label>
        <label>
          최저 가격
          <input name="minimumPrice" type="number" min="0" defaultValue={filters.minimumPrice ?? ""} />
        </label>
        <label>
          최고 가격
          <input name="maximumPrice" type="number" min="0" defaultValue={filters.maximumPrice ?? ""} />
        </label>
        <label>
          정렬
          <select name="sort" defaultValue={filters.sort ?? "latest"}>
            <option value="latest">최신순</option>
            <option value="oldest">등록일 순</option>
            <option value="priceLow">낮은 가격순</option>
            <option value="priceHigh">높은 가격순</option>
            <option value="interest">관심 많은 순</option>
            <option value="discount">많이 썰린 순</option>
          </select>
        </label>
        <button type="submit">조건 적용</button>
      </form>

      {products.length > 0 ? (
        <div>
          {products.map((product) => (
            // Teacher: 목록의 map은 문서를 다시 설계하는 변환이 아니라 JSX 반복입니다. 현재 Server Component 사이로 원본 product를 전달하는 방식과, AGENTS.md의 데이터를 사용하는 컴포넌트에서 조회하는 기준을 비교해 보기.
            <DetailProduct key={product._id.toString()} product={product} />
          ))}
        </div>
      ) : (
        <p>조건에 맞는 상품이 없습니다.</p>
      )}
    </main>
  );
}
