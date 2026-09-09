import Link from "next/link";
import { connection } from "next/server";
import Header from "@/components/Header";
import { signUp } from "@/app/auth-actions";

export default async function SignupPage({ searchParams }) {
  await connection();
  const { error } = await searchParams;

  return (
    <>
      <Header />
      <main className="auth-page page-container">
        <form action={signUp} className="auth-form">
          <p className="eyebrow">JOIN DAEPA</p>
          <h1>회원가입</h1>
          {error && <p className="form-error">{error}</p>}
          <label>닉네임<input name="nickname" required /></label>
          <label>이메일<input name="email" type="email" required /></label>
          <label>비밀번호<input name="password" type="password" minLength="8" required /></label>
          <label>주소<input name="address" required /></label>
          <label>프로필 이미지 URL<input name="profileImage" type="url" /></label>
          <button type="submit">가입하기</button>
          <p>이미 회원인가요? <Link href="/login">로그인</Link></p>
        </form>
      </main>
    </>
  );
}
