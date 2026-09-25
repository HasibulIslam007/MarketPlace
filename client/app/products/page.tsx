import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { Breadcrumbs, Page, PageHeader } from "@/components/ui/Page";
import ProductCard from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/States";
import Tabs, { type TabItem } from "@/components/ui/Tabs";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(category), getCategories()]);
  const activeCategory = categories.find((item) => item.slug === category);

  const tabItems: TabItem[] = [
    { id: "all", label: "All products" },
    ...categories.map((item) => ({ id: item.slug, label: item.name })),
  ];

  return (
    <Page>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />

      <PageHeader
        eyebrow="Catalogue"
        title={activeCategory ? activeCategory.name : "All products"}
        subtitle={`${products.length} product${products.length === 1 ? "" : "s"} available`}
        actions={
          <Link href="/search" className="btn btn-secondary">
            Search catalogue
          </Link>
        }
      />

      <div className="z-toolbar">
        <Tabs
          items={tabItems}
          active={category ?? "all"}
          ariaLabel="Filter by category"
          hrefFor={(id) => (id === "all" ? "/products" : `/products?category=${encodeURIComponent(id)}`)}
        />
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon="package"
          title="No products in this category"
          text="Try another category or browse the full catalogue to find what you need."
          action={
            <Link href="/products" className="btn btn-secondary">
              View all products
            </Link>
          }
        />
      ) : (
        <div className="z-cards">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Page>
  );
}
