"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import SearchOverlay from "@/components/SearchOverlay";
import { Category } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2M12 19.5v2M4.58 4.58l1.42 1.42M18 18l1.42 1.42M2.5 12h2M19.5 12h2M4.58 19.42 6 18M18 6l1.42-1.42" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.84 8.61c0 5.08-8.84 10.39-8.84 10.39S3.16 13.69 3.16 8.61A4.61 4.61 0 0 1 12 6.28a4.61 4.61 0 0 1 8.84 2.33Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8.5h14l1 12H4l1-12Z" />
      <path d="M8.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    let active = true;

    fetch(`${API_URL}/api/categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (active && Array.isArray(data)) setCategories(data as Category[]);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const accountLinks = user ? (
    <>
      {user.role === "admin" && (
        <Link href="/admin" onClick={closeMenu}>
          Admin
        </Link>
      )}
      <span>Hi, {user.name}</span>
      <button
        type="button"
        onClick={() => {
          closeMenu();
          logout();
        }}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/login" onClick={closeMenu}>
        Login
      </Link>
      <Link href="/signup" onClick={closeMenu}>
        Sign Up
      </Link>
    </>
  );

  return (
    <header className="site-header">
      <div className="promo-bar">Free shipping on orders over $75 | Use code ZMART20 for 20% off your first order</div>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="ZMart home" onClick={closeMenu}>
          <span className="brand-mark">ϟ</span>
          <span>ZMart</span>
        </Link>

        <div className="nav-links">
          <Link href="/products">Shop</Link>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-trigger" aria-haspopup="true">
              Categories
              <ChevronDownIcon />
            </button>
            <div className="nav-dropdown-menu">
              <Link href="/products">All Products</Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/products">New Arrivals</Link>
          <Link href="/products">Sale</Link>
          <Link href="/checkout">Checkout</Link>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => {
              closeMenu();
              setSearchOpen(true);
            }}
          >
            <SearchIcon />
          </button>
          <button type="button" className="icon-button" aria-label="Toggle theme">
            <SunIcon />
          </button>
          <button type="button" className="icon-button" aria-label="Wishlist">
            <HeartIcon />
          </button>
          <Link href="/cart" className="icon-button cart-button" aria-label={`Cart with ${cartCount} items`} onClick={closeMenu}>
            <BagIcon />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>

        <div className="nav-account">{accountLinks}</div>

        <button
          type="button"
          className="icon-button menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-menu-links" aria-label="Mobile navigation">
            <button
              type="button"
              className="mobile-menu-search"
              onClick={() => {
                closeMenu();
                setSearchOpen(true);
              }}
            >
              <SearchIcon />
              Search products
            </button>
            <Link href="/" onClick={closeMenu}>Home</Link>
            <Link href="/products" onClick={closeMenu}>Shop</Link>
            <span className="mobile-menu-label">Categories</span>
            <Link href="/products" className="mobile-menu-sub" onClick={closeMenu}>All Products</Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="mobile-menu-sub"
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}
            <Link href="/products" onClick={closeMenu}>New Arrivals</Link>
            <Link href="/products" onClick={closeMenu}>Sale</Link>
            <Link href="/checkout" onClick={closeMenu}>Checkout</Link>
          </nav>
          <div className="mobile-menu-account">{accountLinks}</div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}