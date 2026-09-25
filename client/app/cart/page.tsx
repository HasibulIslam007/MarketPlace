"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHead } from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { Breadcrumbs, Page, PageHeader } from "@/components/ui/Page";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { useCart } from "@/context/CartContext";
import { productImage } from "@/lib/search";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, isReady } = useCart();

  if (!isReady) {
    return (
      <Page>
        <LoadingState label="Loading your cart…" />
      </Page>
    );
  }

  if (items.length === 0) {
    return (
      <Page>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <EmptyState
          icon="bag"
          title="Your cart is empty"
          text="Browse the catalogue and add a few favourites — they will show up right here."
          action={
            <Link href="/products" className="btn btn-primary">
              Start shopping
            </Link>
          }
        />
      </Page>
    );
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Page>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <PageHeader
        eyebrow="Your bag"
        title="Shopping cart"
        subtitle={`${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout`}
      />

      <div className="z-split">
        <Card>
          <CardBody>
            {items.map((item) => {
              const image = productImage(item.product);
              return (
                <div key={item.product.id} className="line-item">
                  <div className="line-item-media">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={item.product.name} />
                    ) : (
                      <div className="pcard-fallback" aria-hidden="true">
                        {item.product.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="z-stack-sm">
                    <Link href={`/products/${item.product.id}`} className="line-item-title">
                      {item.product.name}
                    </Link>
                    <p className="line-item-meta">৳{item.product.price} each</p>
                    {item.product.category ? <Badge tone="soft">{item.product.category.name}</Badge> : null}
                  </div>

                  <div className="line-item-end">
                    <span className="z-price">৳{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                    <div className="qty">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        <Icon name="minus" size={16} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                        aria-label={`Quantity of ${item.product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        <Icon name="plus" size={16} />
                      </button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product.id)}>
                      <Icon name="trash" size={16} /> Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHead title="Order summary" subtitle="Taxes calculated at payment" />
          <CardBody>
            <div className="z-stack-sm">
              <div className="z-summary-row">
                <span>Subtotal</span>
                <strong>৳{total.toFixed(2)}</strong>
              </div>
              <div className="z-summary-row">
                <span>Shipping</span>
                <strong>Free</strong>
              </div>
              <div className="z-divider" />
              <div className="z-summary-total">
                <span>Total</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              <Button block size="lg" href="/checkout">
                Proceed to checkout <Icon name="arrow-right" size={18} />
              </Button>
              <Button block variant="ghost" href="/products">
                Continue shopping
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Page>
  );
}
