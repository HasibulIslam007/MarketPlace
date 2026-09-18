"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getOrderStatus } from "@/lib/api";

function PaymentSuccessContent() {
  const { clearCart } = useCart();
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token || !orderId) return;

    getOrderStatus(token, orderId)
      .then((order) => {
        if (order.status === "paid") {
          clearCart();
          setIsVerified(true);
        }
      })
      .catch(() => undefined);
  }, [clearCart, orderId, token]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment successful</h1>
      <p className="mb-2">
        {isVerified ? "Thank you for your order." : "We are confirming your payment."}
      </p>
      {orderId && <p className="text-gray-600 mb-6">Order #{orderId}</p>}
      <Link href="/products" className="inline-block bg-black text-white rounded px-6 py-2">
        Continue shopping
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12">Loading payment result...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}