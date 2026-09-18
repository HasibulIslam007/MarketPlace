"use client";

import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import { Category, Product } from "@/types/product";

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
  imageUrl: string;
  categoryId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const EMPTY_PRODUCT: NewProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
};

async function readError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.error || fallback;
}

export default function AdminPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>(EMPTY_PRODUCT);
  const [newCategory, setNewCategory] = useState("");
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [productsResponse, categoriesResponse, ordersResponse] = await Promise.all([
        fetch(`${API_URL}/api/products`, { cache: "no-store" }),
        fetch(`${API_URL}/api/categories`, { cache: "no-store" }),
        fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
      ]);

      if (!productsResponse.ok) {
        throw new Error(await readError(productsResponse, "Unable to load products"));
      }
      if (!categoriesResponse.ok) {
        throw new Error(await readError(categoriesResponse, "Unable to load categories"));
      }
      if (!ordersResponse.ok) {
        throw new Error(await readError(ordersResponse, "Unable to load orders"));
      }

      setProducts(await productsResponse.json());
      setCategories(await categoriesResponse.json());
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
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploadResponse = await fetch(`${API_URL}/api/uploads`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ files: imageFiles }),
        });

        if (!uploadResponse.ok) {
          throw new Error(await readError(uploadResponse, "Unable to upload product images"));
        }

        imageUrls = (await uploadResponse.json()).urls;
      }

      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
          categoryId: newProduct.categoryId ? Number(newProduct.categoryId) : null,
          imageUrls,
        }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Unable to add product"));
      }

      setNewProduct({ ...EMPTY_PRODUCT });
      setImageFiles([]);
      setImageNames([]);
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      setError("You can select up to 5 images per product");
      event.target.value = "";
      return;
    }

    try {
      const dataUrls = await Promise.all(files.map((file) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
        reader.readAsDataURL(file);
      })));

      setError("");
      setImageFiles(dataUrls);
      setImageNames(files.map((file) => file.name));
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "Unable to read images");
    }
  }

  async function handleAddCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !newCategory.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Unable to add category"));
      }

      setNewCategory("");
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add category");
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
          <form onSubmit={handleAddCategory} className="flex gap-3 mb-4 border p-4 rounded">
            <input
              placeholder="New category name"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              className="border rounded p-2 flex-1"
              required
            />
            <button type="submit" disabled={submitting} className="bg-gray-800 text-white rounded px-4 disabled:opacity-50">
              Add Category
            </button>
          </form>
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
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-medium">Product images (up to 5)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleImageChange}
                className="block w-full border rounded p-2"
              />
              <p className="text-xs text-gray-500">Upload JPG, PNG, WEBP, or GIF files. Maximum 10 MB each.</p>
              {imageNames.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {imageFiles.map((image, index) => (
                    <div key={imageNames[index]} className="border rounded p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt={imageNames[index]} className="w-full h-20 object-cover rounded" />
                      <p className="text-xs truncate mt-1">{imageNames[index]}</p>
                    </div>
                  ))}
                </div>
              )}
              <input
                placeholder="Legacy image URL (optional)"
                type="url"
                value={newProduct.imageUrl}
                onChange={(event) => setNewProduct({ ...newProduct, imageUrl: event.target.value })}
                className="border rounded p-2 w-full"
              />
            </div>
            <select
              value={newProduct.categoryId}
              onChange={(event) => setNewProduct({ ...newProduct, categoryId: event.target.value })}
              className="border rounded p-2"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button type="submit" disabled={submitting} className="sm:col-span-2 bg-black text-white rounded p-2 disabled:opacity-50">
              {submitting ? "Adding..." : "Add Product"}
            </button>
          </form>

          <div className="space-y-2">
            {products.length === 0 && !loading && <p className="text-sm text-gray-600">No products found.</p>}
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-2 gap-4">
                <span>
                  {product.name} — ৳{product.price} ({product.stock} in stock)
                  {product.category && <span className="text-sm text-gray-500"> · {product.category.name}</span>}
                </span>
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