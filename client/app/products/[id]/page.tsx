import { getProduct } from "@/lib/api";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl font-bold mt-4">${product.price}</p>
      <p className="text-sm text-gray-500 mt-1">In stock: {product.stock}</p>
    </div>
  );
}