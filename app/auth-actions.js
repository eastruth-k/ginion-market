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
    redirect("/signup?error=필수 입력값과 8자 이상의 비밀번호를 확인해주세요.");
  }

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
    redirect("/signup?error=이미 사용 중인 이메일이거나 가입 정보가 올바르지 않습니다.");
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
    redirect("/login?error=이메일 또는 비밀번호를 확인해주세요.");
  }

  redirect("/");
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
