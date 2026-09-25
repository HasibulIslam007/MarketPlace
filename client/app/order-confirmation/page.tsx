"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Page } from "@/components/ui/Page";
import { LoadingState, ResultState } from "@/components/ui/States";
import { useCart } from "@/context/CartContext";

const STATUS = {
  success: {
    tone: "success" as const,
    icon: "check-circle" as const,
    title: "Payment successful",
    text: "Thanks for shopping with ZMart. Your order is confirmed and being prepared.",
  },
  failed: {
    tone: "danger" as const,
    icon: "alert" as const,
    title: "Payment failed",
    text: "We could not complete your payment. Please try again from your cart.",
  },
  cancelled: {
    tone: "warning" as const,
    icon: "alert-circle" as const,
    title: "Payment cancelled",
    text: "You cancelled the payment. Nothing has been charged to your account.",
  },
};

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === "success") clearCart();
  }, [clearCart, status]);

  const result =
    status === "success" ? STATUS.success : status === "failed" ? STATUS.failed : status === "cancelled" ? STATUS.cancelled : null;

  if (!result) {
    return (
      <ResultState
        tone="brand"
        icon="info"
        title="Order status unavailable"
        text="We could not read an order status from this link. Check your account or head back to your cart."
        action={
          <Link href="/cart" className="btn btn-secondary">
            Back to cart
          </Link>
        }
      />
    );
  }

  return (
    <ResultState
      tone={result.tone}
      icon={result.icon}
      title={result.title}
      text={result.text}
      action={
        <>
          <Link href="/products" className="btn btn-primary">
            Continue shopping
          </Link>
          <Link href="/cart" className="btn btn-secondary">
            View cart
          </Link>
        </>
      }
    />
  );
}

export default function OrderConfirmationPage() {
  return (
    <Page narrow>
      <Suspense fallback={<LoadingState label="Loading order status…" />}>
        <OrderConfirmationContent />
      </Suspense>
    </Page>
  );
}
