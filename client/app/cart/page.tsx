"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p>Your cart is empty.</p>
        <Link href="/products" className="underline">Browse products →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-sm text-gray-600">৳{item.product.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                className="w-16 border rounded p-1"
              />
              <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: ৳{total.toFixed(2)}</p>
        <Link href="/checkout" className="inline-block mt-4 bg-black text-white rounded px-6 py-2">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}