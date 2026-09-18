export interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // Prisma sends Decimal as a string over JSON
  stock: number;
  imageUrl: string | null;
  images: ProductImage[];
  categoryId: number | null;
  category: Category | null;
  createdAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number;
}