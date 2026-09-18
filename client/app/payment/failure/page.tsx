import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment was not completed</h1>
      <p className="mb-6">Your order was not marked as paid. You can try again from your cart.</p>
      <Link href="/cart" className="inline-block bg-black text-white rounded px-6 py-2">
        Return to cart
      </Link>
    </div>
  );
}