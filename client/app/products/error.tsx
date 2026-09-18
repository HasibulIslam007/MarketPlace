"use client";

export default function ProductsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Unable to load products</h1>
      <p className="text-gray-600 mb-4">The store is temporarily unavailable. Please try again.</p>
      <button onClick={() => reset()} className="bg-black text-white rounded px-4 py-2">
        Try again
      </button>
    </div>
  );
}