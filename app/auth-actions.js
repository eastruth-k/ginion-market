"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function signUp(formData) {
  const nickname = formData.get("nickname")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const profileImage = formData.get("profileImage")?.toString().trim() ?? "";

  if (!nickname || !email || !address || password.length < 8) {
    const message = encodeURIComponent("필수 입력값과 8자 이상의 비밀번호를 확인해주세요.");
    redirect(`/signup?error=${message}`);
  }

  // Teacher: redirect는 예외를 던져 실행을 끝내므로 넓은 try/catch 안에 두면 성공 이동까지 실패로 잡을 수 있습니다. failed와 try/catch 밖 redirect의 역할을 따라가 보기.
  let failed = false;

  try {
    await auth.api.signUpEmail({
      body: {
        name: nickname,
        email,
        password,
        address,
        image: profileImage || undefined,
      },
    });
  } catch {
    failed = true;
  }

  if (failed) {
    const message = encodeURIComponent("이미 사용 중인 이메일이거나 가입 정보가 올바르지 않습니다.");
    redirect(`/signup?error=${message}`);
  }

  redirect("/");
}

export async function signIn(formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  let failed = false;

  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch {
    failed = true;
  }

  if (failed) {
    const message = encodeURIComponent("이메일 또는 비밀번호를 확인해주세요.");
    redirect(`/login?error=${message}`);
  }

  redirect("/");
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
