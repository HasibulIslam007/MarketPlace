import Link from "next/link";
import Badge, { isNewProduct, stockBadge } from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import { productImage } from "@/lib/search";
import type { Product } from "@/types/product";

/** The single product card used by every product surface (home, catalogue, search, admin). */
export default function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const image = productImage(product);
  const stock = stockBadge(product.stock);
  const isNew = isNewProduct(product.createdAt);
  const soldOut = product.stock <= 0;

  return (
    <Link href={`/products/${product.id}`} className={`pcard ${className}`.trim()}>
      <div className="pcard-media">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} loading="lazy" />
        ) : (
          <div className="pcard-fallback" aria-hidden="true">
            {product.name.charAt(0)}
          </div>
        )}
        {(isNew || soldOut) && (
          <div className="pcard-badges">
            {isNew && !soldOut ? <Badge tone="lime">New</Badge> : null}
            {soldOut ? <Badge tone="danger">Sold out</Badge> : null}
          </div>
        )}
      </div>
      <div className="pcard-body">
        <div className="pcard-meta">
          <span className="pcard-cat">{product.category?.name ?? "Uncategorised"}</span>
          <span className="pcard-stock">{stock.label}</span>
        </div>
        <div className="pcard-name">{product.name}</div>
        {product.description ? <p className="pcard-desc">{product.description}</p> : null}
        <div className="pcard-foot">
          <span className="pcard-price">৳{product.price}</span>
          <span className="z-link">
            View <Icon name="arrow-right" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
