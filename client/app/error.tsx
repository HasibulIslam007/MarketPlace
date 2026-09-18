"use client";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-600 mb-4">We could not load this page. Please try again.</p>
      <button onClick={() => reset()} className="bg-black text-white rounded px-4 py-2">
        Try again
      </button>
    </div>
  );
}