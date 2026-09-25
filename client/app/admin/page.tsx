"use client";

import { useCallback, useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHead } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Page, PageHeader } from "@/components/ui/Page";
import { Banner, EmptyState, LoadingState } from "@/components/ui/States";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { StorefrontCustomizer } from "@/components/StorefrontCustomizer";
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

interface HomePageSettings {
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const EMPTY_PRODUCT: NewProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
};
const EMPTY_HERO_SETTINGS: HomePageSettings = {
  id: 1,
  heroImageUrl: null,
  heroImageAlt: "Featured sneaker",
  heroBadge: "New Collection 2032",
  heroTitle: "Step Into",
  heroTitleAccent: "Your Best",
  heroSubtitle: "Premium footwear for every step of your journey. From athletic performance to everyday comfort.",
  discountTop: "UP TO",
  discountValue: "40%",
  discountBottom: "OFF",
  card1Icon: "truck",
  card1Title: "Free Shipping",
  card1Subtitle: "Orders over $75",
  card2Icon: "refresh",
  card2Title: "Easy Returns",
  card2Subtitle: "60-day guarantee",
};

type TabId = "storefront" | "products" | "orders";

const TABS = [
  { id: "storefront", label: "Storefront" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
];

const ORDER_TONES: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  pending: "warning",
  paid: "success",
  shipped: "info",
  failed: "danger",
  cancelled: "danger",
};

async function readError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.error || fallback;
}

function StatCard({ icon, label, value }: { icon: IconName; label: string; value: number }) {
  return (
    <div className="z-stat">
      <span className="z-stat-label">
        <Icon name={icon} size={16} /> {label}
      </span>
      <span className="z-stat-value">{value}</span>
    </div>
  );
}

export default function AdminPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [heroSettings, setHeroSettings] = useState<HomePageSettings>(EMPTY_HERO_SETTINGS);
  const [heroImageFile, setHeroImageFile] = useState("");
  const [heroImageName, setHeroImageName] = useState("");
  const [newProduct, setNewProduct] = useState<NewProduct>(EMPTY_PRODUCT);
  const [newCategory, setNewCategory] = useState("");
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("storefront");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const toast = useToast();

  const loadData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [productsResponse, categoriesResponse, ordersResponse, heroSettingsResponse] = await Promise.all([
        fetch(`${API_URL}/api/products`, { cache: "no-store" }),
        fetch(`${API_URL}/api/categories`, { cache: "no-store" }),
        fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/homepage-settings`, { cache: "no-store" }),
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
      if (!heroSettingsResponse.ok) {
        throw new Error(await readError(heroSettingsResponse, "Unable to load homepage settings"));
      }

      setProducts(await productsResponse.json());
      setCategories(await categoriesResponse.json());
      setOrders(await ordersResponse.json());
      setHeroSettings(await heroSettingsResponse.json());
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

      const createdName = newProduct.name;
      setNewProduct({ ...EMPTY_PRODUCT });
      setImageFiles([]);
      setImageNames([]);
      toast.success("Product added", `${createdName} is now in the catalogue.`);
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

  async function handleHeroImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
        reader.readAsDataURL(file);
      });

      setError("");
      setHeroImageFile(dataUrl);
      setHeroImageName(file.name);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "Unable to read hero image");
    }
  }

  async function handleSaveHero(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setSavingHero(true);
    setError("");

    try {
      let heroImageUrl = heroSettings.heroImageUrl?.trim() || "";
      if (heroImageFile) {
        const uploadResponse = await fetch(`${API_URL}/api/uploads`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ files: [heroImageFile] }),
        });

        if (!uploadResponse.ok) {
          throw new Error(await readError(uploadResponse, "Unable to upload hero image"));
        }

        heroImageUrl = (await uploadResponse.json()).urls[0];
      }

      const response = await fetch(`${API_URL}/api/homepage-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          heroImageUrl,
          heroImageAlt: heroSettings.heroImageAlt,
          heroBadge: heroSettings.heroBadge,
          heroTitle: heroSettings.heroTitle,
          heroTitleAccent: heroSettings.heroTitleAccent,
          heroSubtitle: heroSettings.heroSubtitle,
          discountTop: heroSettings.discountTop,
          discountValue: heroSettings.discountValue,
          discountBottom: heroSettings.discountBottom,
          card1Icon: heroSettings.card1Icon,
          card1Title: heroSettings.card1Title,
          card1Subtitle: heroSettings.card1Subtitle,
          card2Icon: heroSettings.card2Icon,
          card2Title: heroSettings.card2Title,
          card2Subtitle: heroSettings.card2Subtitle,
        }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Unable to save homepage settings"));
      }

      setHeroSettings(await response.json());
      setHeroImageFile("");
      setHeroImageName("");
      toast.success("Homepage updated", "The hero banner and promotional boxes are now live on the storefront.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save homepage settings");
    } finally {
      setSavingHero(false);
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

      const createdName = newCategory.trim();
      setNewCategory("");
      toast.success("Category added", `${createdName} is ready to use.`);
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add category");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!token || !pendingDelete) return;

    const target = pendingDelete;
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/products/${target.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Unable to delete product"));
      }

      setPendingDelete(null);
      toast.success("Product deleted", `${target.name} was removed from the catalogue.`);
      await loadData();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to delete product";
      setError(message);
      toast.error("Delete failed", message);
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

      toast.success("Order updated", `Order #${orderId} is now ${status}.`);
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update order status");
    }
  }

  return (
    <AdminGuard>
      <Page>
        <PageHeader
          eyebrow="Admin"
          title="Dashboard"
          subtitle="Manage the ZMart catalogue, orders and storefront content."
          actions={
            <>
              <Button variant="secondary" href="/" prefetch={false}>
                <Icon name="home" size={18} /> View store
              </Button>
              <Button variant="ghost" onClick={() => void loadData()} disabled={loading}>
                <Icon name="refresh" size={18} /> Refresh
              </Button>
            </>
          }
        />

        {error ? (
          <div className="z-mb-6">
            <Banner tone="danger">{error}</Banner>
          </div>
        ) : null}

        <div className="z-cards z-mb-8">
          <StatCard icon="package" label="Products" value={products.length} />
          <StatCard icon="clipboard" label="Categories" value={categories.length} />
          <StatCard icon="users" label="Orders" value={orders.length} />
          <StatCard
            icon="check-circle"
            label="Paid orders"
            value={orders.filter((order) => order.status === "paid").length}
          />
        </div>

        <div className="z-toolbar">
          <Tabs
            items={TABS}
            active={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
            ariaLabel="Admin sections"
          />
        </div>

        {loading ? <LoadingState label="Loading dashboard…" /> : null}

        {!loading && activeTab === "storefront" ? (
          <StorefrontCustomizer
            heroSettings={heroSettings}
            setHeroSettings={setHeroSettings}
            heroImageFile={heroImageFile}
            setHeroImageFile={setHeroImageFile}
            heroImageName={heroImageName}
            savingHero={savingHero}
            onHeroImageChange={handleHeroImageChange}
            onSaveHero={handleSaveHero}
          />
        ) : null}

        {!loading && activeTab === "products" ? (
          <div className="z-stack">
            <Card>
              <CardHead title="Add a product" subtitle="Upload images and set the price, stock and category." />
              <CardBody>
                <form onSubmit={handleAddProduct} className="z-form-grid">
                  <div className="z-form-grid z-form-grid-2">
                    <Field label="Name" htmlFor="p-name" required>
                      <Input
                        id="p-name"
                        value={newProduct.name}
                        onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
                        required
                      />
                    </Field>
                    <Field label="Price (৳)" htmlFor="p-price" required>
                      <Input
                        id="p-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
                        required
                      />
                    </Field>
                    <Field label="Stock" htmlFor="p-stock" required>
                      <Input
                        id="p-stock"
                        type="number"
                        min="0"
                        step="1"
                        value={newProduct.stock}
                        onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })}
                        required
                      />
                    </Field>
                    <Field label="Category" htmlFor="p-cat">
                      <Select
                        id="p-cat"
                        value={newProduct.categoryId}
                        onChange={(event) => setNewProduct({ ...newProduct, categoryId: event.target.value })}
                      >
                        <option value="">No category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                  <Field label="Description" htmlFor="p-desc" required>
                    <Textarea
                      id="p-desc"
                      rows={3}
                      value={newProduct.description}
                      onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })}
                      required
                    />
                  </Field>
                  <Field
                    label="Product images (up to 5)"
                    htmlFor="p-images"
                    hint="JPG, PNG, WEBP or GIF · maximum 10 MB each."
                  >
                    <input
                      id="p-images"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      onChange={handleImageChange}
                      className="input"
                    />
                  </Field>

                  {imageNames.length > 0 ? (
                    <div className="z-thumbs">
                      {imageFiles.map((image, index) => (
                        <span key={imageNames[index]} className="z-thumb" title={imageNames[index]}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image} alt={imageNames[index]} />
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <Field label="Legacy image URL (optional)" htmlFor="p-legacy">
                    <Input
                      id="p-legacy"
                      type="url"
                      placeholder="https://…"
                      value={newProduct.imageUrl}
                      onChange={(event) => setNewProduct({ ...newProduct, imageUrl: event.target.value })}
                    />
                  </Field>

                  <div className="z-form-actions">
                    <Button type="submit" loading={submitting}>
                      {submitting ? "Adding…" : "Add product"}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>

            <Card>
              <CardHead
                title="Categories"
                subtitle={`${categories.length} categor${categories.length === 1 ? "y" : "ies"} in use`}
              />
              <CardBody>
                <form onSubmit={handleAddCategory} className="z-row z-mb-6">
                  <div className="z-flex-1">
                    <Field label="New category" htmlFor="new-cat" required>
                      <Input
                        id="new-cat"
                        placeholder="e.g. Running"
                        value={newCategory}
                        onChange={(event) => setNewCategory(event.target.value)}
                        required
                      />
                    </Field>
                  </div>
                  <Button type="submit" variant="secondary" loading={submitting}>
                    Add category
                  </Button>
                </form>

                <div className="z-row">
                  {categories.length === 0 ? (
                    <p className="z-muted">No categories yet — add one above.</p>
                  ) : (
                    categories.map((category) => (
                      <Badge key={category.id} tone="soft">
                        {category.name}
                        {typeof category._count?.products === "number" ? ` · ${category._count.products}` : ""}
                      </Badge>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>

            <Card flush>
              <CardHead
                title="Catalogue"
                subtitle={`${products.length} product${products.length === 1 ? "" : "s"} published`}
              />
              {products.length === 0 ? (
                <div className="card-body">
                  <EmptyState
                    compact
                    icon="package"
                    title="No products yet"
                    text="Add your first product using the form above and it will appear here."
                  />
                </div>
              ) : (
                <div className="table-wrap table-wrap-bare">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="z-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <strong>{product.name}</strong>
                          </td>
                          <td>{product.category?.name ?? "—"}</td>
                          <td>৳{product.price}</td>
                          <td>{product.stock}</td>
                          <td className="z-right">
                            <Button variant="danger" size="sm" onClick={() => setPendingDelete(product)}>
                              <Icon name="trash" size={16} /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        ) : null}

        {!loading && activeTab === "orders" ? (
          <Card flush>
            <CardHead
              title="Orders"
              subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"} placed`}
            />
            {orders.length === 0 ? (
              <div className="card-body">
                <EmptyState
                  compact
                  icon="clipboard"
                  title="No orders yet"
                  text="Orders placed by customers will appear here with their current status."
                />
              </div>
            ) : (
              <div className="table-wrap table-wrap-bare">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td>
                          {order.user.name}
                          <div className="z-hint">{order.user.email}</div>
                        </td>
                        <td>{order.items.map((item) => `${item.quantity}× ${item.product.name}`).join(", ")}</td>
                        <td>৳{order.total}</td>
                        <td>
                          <div className="z-row">
                            <Badge tone={ORDER_TONES[order.status] ?? "neutral"}>{order.status}</Badge>
                            <Select
                              className="z-select-sm"
                              value={order.status}
                              onChange={(event) => handleStatusChange(order.id, event.target.value)}
                              aria-label={`Update status for order ${order.id}`}
                            >
                              <option value="pending">pending</option>
                              <option value="paid">paid</option>
                              <option value="shipped">shipped</option>
                              <option value="failed">failed</option>
                              <option value="cancelled">cancelled</option>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ) : null}
      </Page>

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete product"
        text={
          pendingDelete
            ? `“${pendingDelete.name}” will be permanently removed from the catalogue. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete product"
      />
    </AdminGuard>
  );
}