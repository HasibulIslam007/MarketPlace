"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CheckoutPage() {
  const { token, isReady: authReady } = useAuth();
  const { items, total, isReady: cartReady } = useCart();
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setShipping({ ...shipping, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Please log in before checking out.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: Number(item.product.price),
          })),
          shipping,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");

      window.location.href = data.paymentUrl;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to create order");
      setLoading(false);
    }
  }

  if (!authReady || !cartReady) {
    return <div className="max-w-3xl mx-auto px-4 py-12">Loading checkout...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p>Your cart is empty.</p>
        <Link href="/products" className="underline">Browse products →</Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Log in to checkout</h1>
        <p className="mb-4">You need an account before placing an order.</p>
        <Link
          href="/login?redirect=%2Fcheckout"
          className="inline-block bg-black text-white rounded px-6 py-2"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <p className="mb-4 font-semibold">Total: ৳{total.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" value={shipping.name} onChange={handleChange} className="w-full border rounded p-2" required />
        <input name="email" type="email" placeholder="Email" value={shipping.email} onChange={handleChange} className="w-full border rounded p-2" required />
        <input name="phone" type="tel" placeholder="Phone" value={shipping.phone} onChange={handleChange} className="w-full border rounded p-2" required />
        <input name="address" placeholder="Address" value={shipping.address} onChange={handleChange} className="w-full border rounded p-2" required />
        <input name="city" placeholder="City" value={shipping.city} onChange={handleChange} className="w-full border rounded p-2" required />
        <input name="postcode" placeholder="Postcode" value={shipping.postcode} onChange={handleChange} className="w-full border rounded p-2" required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded p-3 disabled:opacity-50"
        >
          {loading ? "Redirecting to payment..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}