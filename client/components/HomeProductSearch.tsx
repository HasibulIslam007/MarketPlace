"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { productImage, searchProducts } from "@/lib/search";
import { Product } from "@/types/product";

export default function HomeProductSearch({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!normalizedSearchTerm) return products.slice(0, 3);

    return searchProducts(products, normalizedSearchTerm);
  }, [normalizedSearchTerm, products]);

  return (
    <section aria-labelledby="featured-products-heading">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 id="featured-products-heading" className="text-2xl font-bold">
            {normalizedSearchTerm ? "Search results" : "Featured products"}
          </h2>
          <p className="text-gray-600 mt-1">
            {normalizedSearchTerm
              ? `${matchingProducts.length} product${matchingProducts.length === 1 ? "" : "s"} found`
              : "Check out a few of our products"}
          </p>
        </div>
        <div className="w-full sm:w-80">
          <label htmlFor="homepage-product-search" className="sr-only">
            Search products
          </label>
          <input
            id="homepage-product-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products..."
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {matchingProducts.length === 0 ? (
        <p className="border rounded-lg p-6 text-center text-gray-600">
          No products match “{searchTerm}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {matchingProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              {productImage(product) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={productImage(product)}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
              <h3 className="font-semibold">{product.name}</h3>
              {product.category && <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>}
              <p className="mt-2 font-bold">৳{product.price}</p>
            </Link>
          ))}
        </div>
      )}

      {normalizedSearchTerm && matchingProducts.length > 0 && (
        <p className="mt-2 text-center">
          <Link
            href={`/search?q=${encodeURIComponent(searchTerm.trim())}`}
            className="underline font-semibold"
          >
            View all results for “{searchTerm.trim()}” →
          </Link>
        </p>
      )}
    </section>
  );
}