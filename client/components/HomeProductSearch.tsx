"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import Icon from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/Page";
import ProductCard from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/States";
import { searchProducts } from "@/lib/search";
import type { Product } from "@/types/product";

const FEATURED_COUNT = 3;

export default function HomeProductSearch({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const term = searchTerm.trim();

  const visibleProducts = useMemo(() => {
    if (!term) return products.slice(0, FEATURED_COUNT);
    return searchProducts(products, term);
  }, [products, term]);

  return (
    <section aria-labelledby="featured-products-heading" aria-label="Featured collection">
      <SectionHeader
        title={term ? "Search results" : "Featured collection"}
        subtitle={
          term
            ? `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} matching “${term}”`
            : "Our most popular styles, handpicked for you"
        }
        actionLink={
          term
            ? { href: `/search?q=${encodeURIComponent(term)}`, label: "View all results" }
            : { href: "/products", label: "View all products" }
        }
      />

      <div className="z-toolbar">
        <div className="z-search-field">
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products, categories…"
            aria-label="Search products"
          />
        </div>
        {term ? (
          <Button variant="ghost" onClick={() => setSearchTerm("")}>
            <Icon name="close" size={16} /> Clear
          </Button>
        ) : null}
      </div>

      {visibleProducts.length === 0 ? (
        <EmptyState
          compact
          icon="search"
          title="No matching products"
          text={`Nothing matched “${term}”. Try a different keyword or browse the full catalogue.`}
          action={
            <Button variant="secondary" onClick={() => setSearchTerm("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <div className="z-cards z-cards-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
