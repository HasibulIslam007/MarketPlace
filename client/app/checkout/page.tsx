"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHead } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Breadcrumbs, Page, PageHeader } from "@/components/ui/Page";
import { Banner, EmptyState, LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CheckoutPage() {
  const { token, isReady: authReady } = useAuth();
  const { items, total, isReady: cartReady } = useCart();
  const toast = useToast();
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setShipping({ ...shipping, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Please log in before checking out.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: Number(item.product.price),
          })),
          shipping,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");

      window.location.href = data.paymentUrl;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Failed to create order";
      setError(message);
      toast.error("Checkout failed", message);
      setLoading(false);
    }
  }

  if (!authReady || !cartReady) {
    return (
      <Page narrow>
        <LoadingState label="Preparing checkout…" />
      </Page>
    );
  }

  if (items.length === 0) {
    return (
      <Page narrow>
        <EmptyState
          icon="bag"
          title="Nothing to check out"
          text="Your cart is empty. Add a product first and then come back to complete your order."
          action={
            <Link href="/products" className="btn btn-primary">
              Browse products
            </Link>
          }
        />
      </Page>
    );
  }

  if (!token) {
    return (
      <Page narrow>
        <EmptyState
          icon="lock"
          title="Log in to checkout"
          text="You need an account before placing an order. It only takes a few seconds."
          action={
            <>
              <Link href="/login?redirect=%2Fcheckout" className="btn btn-primary">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-secondary">
                Create account
              </Link>
            </>
          }
        />
      </Page>
    );
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Page>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <PageHeader
        eyebrow="Secure checkout"
        title="Shipping details"
        subtitle={`${itemCount} item${itemCount === 1 ? "" : "s"} · you will be redirected to payment`}
      />

      <div className="z-split">
        <Card>
          <CardHead title="Delivery information" subtitle="We use this to deliver and confirm your order." />
          <CardBody>
            <form className="z-form-grid" onSubmit={handleSubmit}>
              <div className="z-form-grid z-form-grid-2">
                <Field label="Full name" htmlFor="name" required>
                  <Input id="name" name="name" placeholder="Jane Doe" value={shipping.name} onChange={handleChange} required />
                </Field>
                <Field label="Email address" htmlFor="email" required>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" value={shipping.email} onChange={handleChange} required />
                </Field>
              </div>

              <div className="z-form-grid z-form-grid-2">
                <Field label="Phone" htmlFor="phone" required>
                  <Input id="phone" name="phone" type="tel" placeholder="01XXXXXXXXX" value={shipping.phone} onChange={handleChange} required />
                </Field>
                <Field label="Postcode" htmlFor="postcode" required>
                  <Input id="postcode" name="postcode" placeholder="1207" value={shipping.postcode} onChange={handleChange} required />
                </Field>
              </div>

              <Field label="Street address" htmlFor="address" required>
                <Input id="address" name="address" placeholder="House, road, area" value={shipping.address} onChange={handleChange} required />
              </Field>

              <Field label="City" htmlFor="city" required>
                <Input id="city" name="city" placeholder="Dhaka" value={shipping.city} onChange={handleChange} required />
              </Field>

              {error ? <Banner tone="danger">{error}</Banner> : null}

              <Button type="submit" size="lg" loading={loading}>
                {loading ? "Redirecting to payment…" : "Pay now"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHead title="Order summary" subtitle={`${items.length} product${items.length === 1 ? "" : "s"}`} />
          <CardBody>
            <div className="z-stack-sm">
              {items.map((item) => (
                <div key={item.product.id} className="z-summary-row">
                  <span className="z-truncate">
                    {item.product.name} × {item.quantity}
                  </span>
                  <strong>৳{(Number(item.product.price) * item.quantity).toFixed(2)}</strong>
                </div>
              ))}

              <div className="z-divider" />
              <div className="z-summary-row">
                <span>Subtotal</span>
                <strong>৳{total.toFixed(2)}</strong>
              </div>
              <div className="z-summary-row">
                <span>Shipping</span>
                <strong>Free</strong>
              </div>
              <div className="z-summary-total">
                <span>Total</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              <Button block variant="ghost" href="/cart">
                Edit cart
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Page>
  );
}