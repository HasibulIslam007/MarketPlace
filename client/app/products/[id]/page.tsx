import ProductDetail from "@/components/ProductDetail";
import { getProduct } from "@/lib/api";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductDetail product={product} />;
}