"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchOverlay from "@/components/SearchOverlay";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Category } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isShopActive = pathname === "/products" || pathname.startsWith("/products/");
  const isCheckoutActive = pathname === "/checkout" || pathname === "/cart";

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
      <div className="promo-bar">Free shipping on orders over 2000 Taka | Use code ZMART20 for 20% off your first order</div>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="ZMart home" onClick={closeMenu}>
          <span className="brand-mark">ϟ</span>
          <span>ZMart</span>
        </Link>

        <div className="nav-links">
          <Link
            href="/products"
            className={isShopActive ? "is-active" : undefined}
            aria-current={isShopActive ? "page" : undefined}
          >
            Shop
          </Link>
          <div className="nav-dropdown">
            <button type="button" className="nav-dropdown-trigger" aria-haspopup="true">
              Categories
              <Icon name="chevron-down" size={14} />
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
          <Link
            href="/checkout"
            className={isCheckoutActive ? "is-active" : undefined}
            aria-current={isCheckoutActive ? "page" : undefined}
          >
            Checkout
          </Link>
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
            <Icon name="search" />
          </button>
          <button type="button" className="icon-button" aria-label="Toggle theme">
            <Icon name="sun" />
          </button>
          <button type="button" className="icon-button" aria-label="Wishlist">
            <Icon name="heart" />
          </button>
          <Link href="/cart" className="icon-button cart-button" aria-label={`Cart with ${cartCount} items`} onClick={closeMenu}>
            <Icon name="bag" />
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
          <Icon name={menuOpen ? "close" : "menu"} />
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
              <Icon name="search" size={18} />
              Search products
            </button>
            <Link href="/" onClick={closeMenu}>Home</Link>
            <Link href="/products" className={isShopActive ? "is-active" : undefined} onClick={closeMenu}>Shop</Link>
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
