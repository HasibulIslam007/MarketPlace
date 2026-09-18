"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === "success") clearCart();
  }, [clearCart, status]);

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      {status === "success" && <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>}
      {status === "failed" && <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>}
      {status === "cancelled" && <h1 className="text-2xl font-bold text-yellow-600">Payment Cancelled</h1>}
      {!status && <h1 className="text-2xl font-bold">Order status unavailable</h1>}
      <Link href="/products" className="underline mt-6 inline-block">Continue shopping →</Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-12 text-center">Loading order status...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}