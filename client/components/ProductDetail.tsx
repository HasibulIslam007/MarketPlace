"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl font-bold mt-4">৳{product.price}</p>
      <p className="text-sm text-gray-500 mt-1">In stock: {product.stock}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-4 bg-black text-white rounded px-4 py-2"
      >
        Add to Cart
      </button>
    </div>
  );
}