"use client";

import Link from "next/link";
import { useState } from "react";
import Badge, { stockBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Breadcrumbs, Page } from "@/components/ui/Page";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/context/CartContext";
import { productImage } from "@/lib/search";
import type { Product } from "@/types/product";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const toast = useToast();
  const [selected, setSelected] = useState(0);

  const primary = productImage(product);
  const images = product.images?.length ? product.images.map((image) => image.url) : primary ? [primary] : [];
  const activeImage = images[selected] ?? images[0];
  const stock = stockBadge(product.stock);
  const soldOut = product.stock <= 0;

  function handleAddToCart() {
    addToCart(product);
    toast.success("Added to cart", `${product.name} is now in your bag.`);
  }

  return (
    <Page>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          ...(product.category
            ? [{ label: product.category.name, href: `/products?category=${encodeURIComponent(product.category.slug)}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="z-product-view">
        <div className="z-gallery">
          <div className="z-gallery-main">
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeImage} alt={product.name} />
            ) : (
              <div className="z-gallery-fallback" aria-hidden="true">
                {product.name.charAt(0)}
              </div>
            )}
          </div>
          {images.length > 1 ? (
            <div className="z-thumbs" aria-label="Product images">
              {images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className={`z-thumb ${selected === index ? "is-active" : ""}`.trim()}
                  onClick={() => setSelected(index)}
                  aria-label={`Show product image ${index + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="z-stack">
          <div className="z-row">
            <Badge tone={stock.tone}>{stock.label}</Badge>
            {product.category ? (
              <Link
                href={`/products?category=${encodeURIComponent(product.category.slug)}`}
                className="z-link"
              >
                {product.category.name}
              </Link>
            ) : null}
          </div>

          <h1 className="z-title">{product.name}</h1>
          {product.description ? <p className="z-prose">{product.description}</p> : null}
          <div className="z-price-lg">৳{product.price}</div>

          <ul className="z-detail-list">
            <li>
              <Icon name="bag" /> Ships within 24 hours
            </li>
            <li>
              <Icon name="truck" /> Free shipping on orders over $75
            </li>
            <li>
              <Icon name="refresh" /> 60-day easy returns
            </li>
          </ul>

          <div className="z-actions">
            <Button size="lg" onClick={handleAddToCart} disabled={soldOut}>
              <Icon name="bag" size={18} />
              {soldOut ? "Out of stock" : "Add to cart"}
            </Button>
            <Button size="lg" variant="secondary" href="/cart">
              Go to cart
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
