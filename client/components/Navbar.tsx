"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <nav className="border-b px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
      <Link href="/" className="font-bold text-lg">
        MyStore
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <Link href="/cart" className="hover:underline">
          Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})
        </Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            )}
            <span className="text-sm text-gray-600">Hi, {user.name}</span>
            <button onClick={logout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}