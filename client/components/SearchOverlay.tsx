"use client";

import Form from "next/form";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { productImage, searchProducts } from "@/lib/search";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const MAX_SUGGESTIONS = 6;
const POPULAR_SEARCHES = ["sneakers", "formal", "kids", "running", "sale"];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 9h13M10 4l5 5-5 5" />
    </svg>
  );
}

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load the catalogue once, the first time the overlay is opened.
  useEffect(() => {
    if (!open || loaded) return;
    let active = true;

    fetch(`${API_URL}/api/products`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (!active) return;
        setProducts(Array.isArray(data) ? (data as Product[]) : []);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [open, loaded]);

  // Lock page scroll, focus the input and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const term = query.trim();
  const results = useMemo(() => searchProducts(products, term), [products, term]);
  const suggestions = results.slice(0, MAX_SUGGESTIONS);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        className="search-overlay-backdrop"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="search-overlay-panel">
        <div className="search-overlay-inner">
          <Form className="search-form" action="/search" role="search" onSubmit={onClose}>
            <span className="search-form-icon">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              className="search-input"
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, categories, deals..."
              autoComplete="off"
              aria-label="Search products"
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <CloseIcon />
              </button>
            )}
            <button type="submit" className="search-submit">
              Search
            </button>
          </Form>

          <div className="search-overlay-results" aria-live="polite">
            {!term ? (
              <div className="search-hint">
                <p className="search-hint-title">Popular searches</p>
                <div className="search-chips">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="search-chip"
                      onClick={() => setQuery(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : !loaded ? (
              <p className="search-status">Loading products…</p>
            ) : suggestions.length === 0 ? (
              <p className="search-status">No products match “{term}”. Try another keyword.</p>
            ) : (
              <>
                <div className="search-results-head">
                  <span>
                    {results.length} result{results.length === 1 ? "" : "s"} for “{term}”
                  </span>
                  <span className="search-results-hint">Press Esc to close</span>
                </div>
                <div className="search-results-grid">
                  {suggestions.map((product) => {
                    const image = productImage(product);
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="search-result-card"
                        onClick={onClose}
                      >
                        <span className="search-result-image">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={product.name} />
                          ) : (
                            <span className="search-result-image-fallback" aria-hidden="true">
                              {product.name.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="search-result-body">
                          {product.category && (
                            <span className="search-result-category">{product.category.name}</span>
                          )}
                          <span className="search-result-name">{product.name}</span>
                          <span className="search-result-price">৳{product.price}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="search-view-all"
                  onClick={onClose}
                >
                  View all {results.length} result{results.length === 1 ? "" : "s"} <ArrowIcon />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
