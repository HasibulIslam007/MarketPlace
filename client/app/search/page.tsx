import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { productImage, searchProducts } from "@/lib/search";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Search | ZMart",
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 9h13M10 4l5 5-5 5" />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
  const image = productImage(product);

  return (
    <Link href={`/products/${product.id}`} className="product-card">
      <span className="product-card-media">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} />
        ) : (
          <span className="product-card-media-fallback" aria-hidden="true">
            {product.name.charAt(0)}
          </span>
        )}
        {product.category && <span className="product-card-badge">{product.category.name}</span>}
      </span>
      <span className="product-card-body">
        <span className="product-card-name">{product.name}</span>
        <p className="product-card-desc">{product.description}</p>
        <span className="product-card-foot">
          <span className="product-card-price">৳{product.price}</span>
          <span className="product-card-cta">
            View <ArrowIcon />
          </span>
        </span>
      </span>
    </Link>
  );
}

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
    <main className="search-page">
      <div className="search-page-inner">
        <header className="search-page-header">
          <span className="search-page-eyebrow">Product search</span>
          <h1>Find your next pair</h1>
          <p className="search-page-subtitle">
            Search the whole ZMart catalogue by name, description or category.
          </p>
          <Form className="search-form" action="/search" role="search">
            <span className="search-form-icon">
              <SearchIcon />
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
        </header>

        {query ? (
          results.length > 0 ? (
            <section className="search-page-results" aria-label="Search results">
              <div className="search-page-summary">
                <h2>
                  {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
                </h2>
                <Link href="/products" className="search-page-browse">
                  Browse all products
                </Link>
              </div>
              <div className="search-page-grid">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ) : (
            <section className="search-empty" aria-live="polite">
              <h2>No products found</h2>
              <p>
                We couldn’t find anything for “{query}”. Try a shorter keyword or browse the full
                catalogue.
              </p>
              <div className="search-chips search-empty-chips">
                <Link href="/products" className="search-chip">
                  All products
                </Link>
              </div>
            </section>
          )
        ) : (
          <section className="search-empty">
            <h2>Start typing to search</h2>
            <p>
              Look up running shoes, formal pairs, kids’ favourites and more — matching products
              appear as cards below.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
