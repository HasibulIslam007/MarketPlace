import { notFound } from "next/navigation";
import { Category, Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PUBLIC_CACHE_SECONDS = 60;

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

// ---- Public product routes ----
export function getProducts(categorySlug?: string): Promise<Product[]> {
  const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
  return apiFetch(`/api/products${query}`, {}, PUBLIC_CACHE_SECONDS);
}

export function getCategories(): Promise<Category[]> {
  return apiFetch("/api/categories", {}, PUBLIC_CACHE_SECONDS);
}

export interface HomePageSettings {
  id: number;
  heroImageUrl: string | null;
  heroImageAlt: string;
}

export function getHomePageSettings(): Promise<HomePageSettings> {
  return apiFetch("/api/homepage-settings", {}, PUBLIC_CACHE_SECONDS);
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    cache: "force-cache",
    next: { revalidate: PUBLIC_CACHE_SECONDS },
  });

  if (res.status === 404) notFound();
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch product");
  }

  return data;
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