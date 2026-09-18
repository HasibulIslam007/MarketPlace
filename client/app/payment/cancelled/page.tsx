import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment cancelled</h1>
      <p className="mb-6">No payment was taken. You can return to your cart and try again.</p>
      <Link href="/cart" className="inline-block bg-black text-white rounded px-6 py-2">
        Return to cart
      </Link>
    </div>
  );
}