"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { toggleWatchlist } from "@/lib/watchlists";

export async function changeWatchlist(productId) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  await toggleWatchlist(session.user.id, productId);
  revalidatePath(`/products/${productId}`);
  revalidatePath("/my-board");
}
