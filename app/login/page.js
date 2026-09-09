import Link from "next/link";
import { connection } from "next/server";
import Header from "@/components/Header";
import { signIn } from "@/app/auth-actions";

export default async function LoginPage({ searchParams }) {
  await connection();
  const { error } = await searchParams;

  return (
    <>
      <Header />
      <main className="auth-page page-container">
        <form action={signIn} className="auth-form">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>로그인</h1>
          {error && <p className="form-error">{error}</p>}
          <label>이메일<input name="email" type="email" required /></label>
          <label>비밀번호<input name="password" type="password" minLength="8" required /></label>
          <button type="submit">로그인</button>
          <p>처음 오셨나요? <Link href="/signup">회원가입</Link></p>
        </form>
      </main>
    </>
  );
}
