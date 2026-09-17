import Link from "next/link";
import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome to the Store</h1>
      <p className="text-gray-600 mb-8">Check out a few of our products</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {featured.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="border rounded-lg p-4 hover:shadow-md transition">
            <h2 className="font-semibold">{product.name}</h2>
            <p className="mt-2 font-bold">${product.price}</p>
          </Link>
        ))}
      </div>

      <Link href="/products" className="underline font-medium">
        View all products →
      </Link>
    </div>
  );
}