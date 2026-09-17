export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // Prisma sends Decimal as a string over JSON
  stock: number;
  imageUrl: string | null;
  createdAt: string;
}