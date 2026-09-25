import { notFound } from "next/navigation";
import { Category, Product } from "@/types/product";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const PUBLIC_CACHE_SECONDS = 60;
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

type ApiFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

// ---- Helper: does the actual fetching + error handling ----
async function apiFetch(path: string, options: ApiFetchOptions = {}, revalidate?: number) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: revalidate ? "force-cache" : "no-store",
    ...(revalidate ? { next: { revalidate } } : {}),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

// Safe wrapper for public (SEO / SSG) fetches.
// During `next build` on Vercel the API may not be reachable yet —
// return a fallback instead of crashing the whole build.
async function safeFetch<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // Warn in logs but don't fail the build / render.
    console.warn(`[api] ${label} failed, using fallback:`, (error as Error)?.message);
    return fallback;
  }
}

// ---- Public product routes (safe for build/prerender: never throw at build time) ----
export function getProducts(categorySlug?: string): Promise<Product[]> {
  const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
  const task = () => apiFetch(`/api/products${query}`, {}, PUBLIC_CACHE_SECONDS);
  if (IS_BUILD) return safeFetch(task, [], `GET /api/products${query}`);
  return task();
}

export function getCategories(): Promise<Category[]> {
  const task = () => apiFetch("/api/categories", {}, PUBLIC_CACHE_SECONDS);
  if (IS_BUILD) return safeFetch(task, [], "GET /api/categories");
  return task();
}

export interface HomePageSettings {
  id: number;
  heroImageUrl: string | null;
  heroImageAlt: string;
  heroBadge?: string;
  heroTitle?: string;
  heroTitleAccent?: string;
  heroSubtitle?: string;
  discountTop?: string;
  discountValue?: string;
  discountBottom?: string;
  card1Icon?: string;
  card1Title?: string;
  card1Subtitle?: string;
  card2Icon?: string;
  card2Title?: string;
  card2Subtitle?: string;
}

export function getHomePageSettings(): Promise<HomePageSettings> {
  const fallback: HomePageSettings = {
    id: 1,
    heroImageUrl: null,
    heroImageAlt: "Featured sneaker",
  };
  const task = () => apiFetch("/api/homepage-settings", {}, PUBLIC_CACHE_SECONDS);
  if (IS_BUILD) return safeFetch(task, fallback, "GET /api/homepage-settings");
  return task();
}

export async function getProduct(id: string): Promise<Product> {
  const doFetch = async () => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      cache: "force-cache",
      next: { revalidate: PUBLIC_CACHE_SECONDS },
    });

    if (res.status === 404) notFound();
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error || "Failed to fetch product");
    }

    return data as Product;
  };

  // Never break `next build` prerender if the API is unreachable.
  if (IS_BUILD) {
    try {
      return await doFetch();
    } catch (error) {
      console.warn(`[api] GET /api/products/${id} failed during build:`, (error as Error)?.message);
      notFound();
    }
  }

  return doFetch();
}

// ---- Admin-only product routes (require a token) ----
export function createProduct(token: string, product: Partial<Product>) {
  return apiFetch("/api/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  });
}

export function updateProduct(token: string, id: number, product: Partial<Product>) {
  return apiFetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  });
}

export function deleteProduct(token: string, id: number) {
  return apiFetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Auth routes ----
export function signup(name: string, email: string, password: string) {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface CheckoutItem {
  productId: number;
  quantity: number;
}

export interface CheckoutDetails {
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostcode: string;
}

export function initiateSSLCommerzPayment(
  token: string,
  items: CheckoutItem[],
  details: CheckoutDetails
): Promise<{ paymentUrl: string; orderId: number }> {
  return apiFetch("/api/payments/sslcommerz/initiate", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items, ...details }),
  });
}

export function getOrderStatus(token: string, orderId: string) {
  return apiFetch(`/api/payments/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  }) as Promise<{ id: number; status: string; total: string; currency: string }>;
}