import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(category), getCategories()]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{category ? "Products in category" : "All Products"}</h1>
        <nav className="flex flex-wrap gap-2 text-sm" aria-label="Product categories">
          <Link href="/products" className={`rounded border px-3 py-1 ${!category ? "bg-black text-white" : ""}`}>
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/products?category=${encodeURIComponent(item.slug)}`}
              className={`rounded border px-3 py-1 ${category === item.slug ? "bg-black text-white" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              {(product.images?.[0]?.url || product.imageUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images?.[0]?.url || product.imageUrl || ""} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded mb-4 flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
              <h2 className="font-semibold">{product.name}</h2>
              {product.category && <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>}
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="mt-2 font-bold">৳{product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}