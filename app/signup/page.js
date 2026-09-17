import Link from "next/link";
import { connection } from "next/server";
import { signUp } from "@/app/auth-actions";
import AddressSearch from "@/app/signup/address-search";

export default async function SignupPage({ searchParams }) {
  await connection();
  const { error } = await searchParams;

  return (
    <main className="auth-page">
      <form className="auth-form" action={signUp}>
        <p className="eyebrow">JOIN DAEPA</p>
        <h1>회원가입</h1>
        <p className="auth-description">내 동네에서 시작하는 새로운 중고거래에 참여하세요.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>
          닉네임
          <input name="nickname" autoComplete="nickname" required />
        </label>
        <label>
          이메일
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          비밀번호
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength="8"
            required
          />
        </label>
        <AddressSearch />
        <button type="submit">가입하기</button>
        <p>이미 회원인가요? <Link href="/login">로그인</Link></p>
      </form>
    </main>
  );
}
