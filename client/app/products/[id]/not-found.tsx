import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <p>Product not found.</p>
      <Link href="/products" className="underline mt-4 inline-block">
        Back to products →
      </Link>
    </div>
  );
}