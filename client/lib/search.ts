import type { Product } from "@/types/product";

/** Returns the best available display image for a product. */
export function productImage(product: Product): string {
  return product.images?.[0]?.url || product.imageUrl || "";
}

function searchableText(product: Product): string {
  return [product.name, product.description, product.category?.name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** Case-insensitive match across a product's name, description and category. */
export function matchesSearch(product: Product, term: string): boolean {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return false;
  return searchableText(product).includes(normalized);
}

/** Filters a product list down to the ones matching the search term. */
export function searchProducts(products: Product[], term: string): Product[] {
  return products.filter((product) => matchesSearch(product, term));
}
