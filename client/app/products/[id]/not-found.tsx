import Link from "next/link";
import { Page } from "@/components/ui/Page";
import { EmptyState } from "@/components/ui/States";

export default function ProductNotFound() {
  return (
    <Page narrow>
      <EmptyState
        icon="search"
        title="Product not found"
        text="This product may have been removed or is no longer available. Explore the catalogue for something similar."
        action={
          <Link href="/products" className="btn btn-primary">
            Browse products
          </Link>
        }
      />
    </Page>
  );
}
