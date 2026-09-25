"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Page } from "@/components/ui/Page";
import { LoadingState, ResultState } from "@/components/ui/States";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
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
    <ResultState
      tone="success"
      icon="check-circle"
      title="Payment successful"
      text={
        isVerified
          ? "Thank you for your order — a confirmation is on its way to your inbox."
          : "We are confirming your payment. This usually takes a few seconds."
      }
      meta={orderId ? `Order #${orderId}` : undefined}
      action={
        <Link href="/products" className="btn btn-primary">
          Continue shopping
        </Link>
      }
    />
  );
}

export default function PaymentSuccessPage() {
  return (
    <Page narrow>
      <Suspense fallback={<LoadingState label="Loading payment result…" />}>
        <PaymentSuccessContent />
      </Suspense>
    </Page>
  );
}
