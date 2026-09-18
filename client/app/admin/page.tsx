"use client";

import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/product";

interface Order {
  id: number;
  status: string;
  total: string | number;
  user: { name: string; email: string };
  items: { quantity: number; product: { name: string } }[];
}

interface NewProduct {
  name: string;
  description: string;
  price: string;
  stock: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const EMPTY_PRODUCT: NewProduct = { name: "", description: "", price: "", stock: "" };

async function readError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.error || fallback;
}

export default function AdminPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch(`${API_URL}/api/products`, { cache: "no-store" }),
        fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
      ]);

      if (!productsResponse.ok) {
        throw new Error(await readError(productsResponse, "Unable to load products"));
      }
      if (!ordersResponse.ok) {
        throw new Error(await readError(ordersResponse, "Unable to load orders"));
      }

      setProducts(await productsResponse.json());
      setOrders(await ordersResponse.json());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load admin data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadData, token]);

  async function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Unable to add product"));
      }

      setNewProduct({ ...EMPTY_PRODUCT });
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!token || !window.confirm("Delete this product?")) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Unable to delete product"));
      }

      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete product");
    }
  }

  async function handleStatusChange(orderId: number, status: string) {
    if (!token) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Unable to update order status"));
      }

      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update order status");
    }
  }

  return (
    <AdminGuard>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-sm text-gray-600">Loading dashboard...</p>}

        <section>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 border p-4 rounded">
            <input
              placeholder="Name"
              value={newProduct.name}
              onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
              className="border rounded p-2"
              required
            />
            <input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={newProduct.price}
              onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
              className="border rounded p-2"
              required
            />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              step="1"
              value={newProduct.stock}
              onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })}
              className="border rounded p-2"
              required
            />
            <input
              placeholder="Description"
              value={newProduct.description}
              onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })}
              className="border rounded p-2"
              required
            />
            <button type="submit" disabled={submitting} className="sm:col-span-2 bg-black text-white rounded p-2 disabled:opacity-50">
              {submitting ? "Adding..." : "Add Product"}
            </button>
          </form>

          <div className="space-y-2">
            {products.length === 0 && !loading && <p className="text-sm text-gray-600">No products found.</p>}
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-2 gap-4">
                <span>{product.name} — ৳{product.price} ({product.stock} in stock)</span>
                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 text-sm" type="button">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <div className="space-y-3">
            {orders.length === 0 && !loading && <p className="text-sm text-gray-600">No orders found.</p>}
            {orders.map((order) => (
              <div key={order.id} className="border rounded p-4">
                <p className="font-semibold">Order #{order.id} — {order.user.name} ({order.user.email})</p>
                <p className="text-sm text-gray-600">
                  {order.items.map((item) => `${item.quantity}x ${item.product.name}`).join(", ")}
                </p>
                <p className="mt-1">Total: ৳{order.total}</p>
                <select
                  value={order.status}
                  onChange={(event) => handleStatusChange(order.id, event.target.value)}
                  className="mt-2 border rounded p-1"
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="shipped">shipped</option>
                  <option value="failed">failed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminGuard>
  );
}