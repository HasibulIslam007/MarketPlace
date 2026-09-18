"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const imageUrls = product.images?.length
    ? product.images.map((image) => image.url)
    : product.imageUrl
      ? [product.imageUrl]
      : [];
  const [selectedImage, setSelectedImage] = useState(0);
  const activeImage = imageUrls[selectedImage] || imageUrls[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {activeImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={activeImage} alt={product.name} className="w-full max-h-96 object-contain bg-gray-50 rounded-lg mb-4" />
      ) : (
        <div className="w-full h-96 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-500">No image</div>
      )}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 mb-6" aria-label="Product images">
          {imageUrls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`border rounded p-1 ${selectedImage === index ? "border-black" : "border-gray-200"}`}
              aria-label={`Show product image ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-16 h-16 object-cover rounded" />
            </button>
          ))}
        </div>
      )}
      <h1 className="text-2xl font-bold">{product.name}</h1>
      {product.category && <p className="text-sm text-gray-500 mt-1">Category: {product.category.name}</p>}
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