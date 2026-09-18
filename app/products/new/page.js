import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import ProductForm from "@/app/products/new/product-form";
import { auth } from "@/lib/auth";
import { getProductCategories } from "@/lib/categories";

export default async function NewProductPage() {
  await connection();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const categories = await getProductCategories();

  return (
    <main>
      <div>
        <div>
          <p>SELL</p>
          <h1>상품 등록</h1>
        </div>
      </div>
      <ProductForm categories={categories} />
    </main>
  );
}
