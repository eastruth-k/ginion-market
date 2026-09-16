import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { connection } from "next/server";
import { signOut } from "@/app/auth-actions";
import { auth } from "@/lib/auth";

export default async function Header() {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* 로고 */}
        <Link href="/" className="logo">
          <Image
          src={"/images/daepa.webp"}
          alt="대파마켓 로고"
          width={60} height={60}
          priority
          >
          </Image>
          <span>대파마켓</span>
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
          <Link href="/products">상품</Link>
          {session && <Link href="/products/new">상품 등록</Link>}
          <Link href="/my-board">내 도마</Link>
          {session ? <Link href="/mypage">my</Link> : <Link href="/login">로그인</Link>}
        </nav>

        {/* 상품 등록 */}
        {session ? (
          <form action={signOut} className="signout-form">
            <button type="submit">로그아웃</button>
          </form>
        ) : (
          <Link href="/signup" className="register-button">회원가입</Link>
        )}
      </div>
    </header>
  );
}
