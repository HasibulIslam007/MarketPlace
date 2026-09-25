import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import { Breadcrumbs, Page, PageHeader } from "@/components/ui/Page";
import ProductCard from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/States";
import { searchProducts } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search | ZMart",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? "").trim();

  const products = await getProducts();
  const results = query ? searchProducts(products, query) : [];

  return (
    <Page>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <PageHeader
        eyebrow="Product search"
        title={query ? `Results for “${query}”` : "Find your next pair"}
        subtitle={
          query
            ? `${results.length} product${results.length === 1 ? "" : "s"} matched your search`
            : "Search the whole ZMart catalogue by name, description or category."
        }
      />

      <div className="z-toolbar">
        <Form className="search-form z-search-field" action="/search" role="search">
          <span className="search-form-icon">
            <Icon name="search" />
          </span>
          <input
            className="search-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search products, categories, deals..."
            autoComplete="off"
            aria-label="Search products"
          />
          <button type="submit" className="search-submit">
            Search
          </button>
        </Form>
      </div>

      {query ? (
        results.length > 0 ? (
          <div className="z-cards">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No products found"
            text={`We couldn’t find anything for “${query}”. Try a shorter keyword or browse the full catalogue.`}
            action={
              <Link href="/products" className="btn btn-secondary">
                Browse all products
              </Link>
            }
          />
        )
      ) : (
        <EmptyState
          icon="sparkles"
          title="Start typing to search"
          text="Look up running shoes, formal pairs, kids’ favourites and more — matching products appear here as cards."
        />
      )}
    </Page>
  );
}

