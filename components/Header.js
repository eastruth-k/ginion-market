import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">

        {/* 로고 */}
        <Link href="/" className="logo">
          🥬 대파마켓
        </Link>

        {/* 검색 */}
        <form action="/products" className="search-form">
          <input
            type="search"
            name="q"
            placeholder="상품명, 브랜드, 카테고리로 검색해보세요"
          />
          <button type="submit">검색</button>
        </form>

        {/* 메뉴 */}
        <nav>
          <Link href="/">홈</Link>
          <Link href="/products">상품</Link>
          <Link href="/my-board">내 도마</Link>
          <Link href="/mypage">마이페이지</Link>
        </nav>

        {/* 상품 등록 */}
        <Link href="/products/new" className="register-button">
          상품 등록
        </Link>

      </div>
    </header>
  );
}