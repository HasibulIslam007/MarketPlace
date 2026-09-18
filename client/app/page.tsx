import Link from "next/link";
import { getProducts } from "@/lib/api";
import HomeProductSearch from "@/components/HomeProductSearch";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome to the Store</h1>
      <p className="text-gray-600 mb-8">Find the right product for you</p>

      <HomeProductSearch products={products} />

      <Link href="/products" className="underline font-medium">
        View all products →
      </Link>
    </div>
  );
}