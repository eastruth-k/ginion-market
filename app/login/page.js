import Link from "next/link";
import { connection } from "next/server";
import { signIn } from "@/app/auth-actions";

export default async function LoginPage({ searchParams }) {
  await connection();
  const { error } = await searchParams;

  return (
    <main className="auth-page">
      <form className="auth-form" action={signIn}>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>로그인</h1>
        <p className="auth-description">대파마켓에서 기다릴수록 내려가는 가격을 확인하세요.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>
          이메일
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          비밀번호
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            minLength="8"
            required
          />
        </label>
        <button type="submit">로그인</button>
        <p>처음 오셨나요? <Link href="/signup">회원가입</Link></p>
      </form>
    </main>
  );
}
