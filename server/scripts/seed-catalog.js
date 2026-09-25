require("dotenv").config();

const prisma = require("../prismaClient");

const categories = [
  {
    name: "Formal Shoes",
    slug: "formal-shoes",
  },
  {
    name: "Slip-ons",
    slug: "slip-ons",
  },
  {
    name: "Kids' Shoes",
    slug: "kids-shoes",
  },
  {
    name: "Outdoor",
    slug: "outdoor",
  },
];

const products = [
  {
    name: "Executive Leather Oxford",
    description: "Polished leather Oxfords with a comfortable cushioned footbed for work and special occasions.",
    price: "6800",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "formal-shoes",
  },
  {
    name: "Classic Penny Loafer",
    description: "A timeless penny loafer with a flexible sole and refined finish for everyday formal style.",
    price: "5600",
    stock: 24,
    imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "formal-shoes",
  },
  {
    name: "Cloud Walk Slip-on",
    description: "Lightweight slip-ons with soft stretch panels that make busy days feel effortless.",
    price: "3900",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "slip-ons",
  },
  {
    name: "Canvas Daily Slip-on",
    description: "Breathable canvas slip-ons with a durable rubber outsole for relaxed everyday wear.",
    price: "3200",
    stock: 26,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "slip-ons",
  },
  {
    name: "Kids' Active Runner",
    description: "A lightweight, secure-fitting runner designed to keep growing feet comfortable during play.",
    price: "2800",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e16e4f4f8d?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "kids-shoes",
  },
  {
    name: "Little Trek Velcro Shoe",
    description: "Easy-close kids' shoes with a supportive sole and plenty of room for active days.",
    price: "2500",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "kids-shoes",
  },
  {
    name: "Trailblazer Hiking Boot",
    description: "Rugged hiking boots with dependable grip and ankle support for trails and weekend adventures.",
    price: "7600",
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "outdoor",
  },
  {
    name: "Summit Outdoor Sneaker",
    description: "Versatile outdoor sneakers with a grippy outsole and breathable construction for daily exploration.",
    price: "6100",
    stock: 16,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
    categorySlug: "outdoor",
  },
];

async function main() {
  const categoryBySlug = new Map();

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });

    categoryBySlug.set(category.slug, category);
  }

  let createdProducts = 0;
  let skippedProducts = 0;

  for (const productData of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: productData.name },
    });

    if (existingProduct) {
      skippedProducts += 1;
      continue;
    }

    const category = categoryBySlug.get(productData.categorySlug);
    const { categorySlug, imageUrl, ...product } = productData;

    await prisma.product.create({
      data: {
        ...product,
        imageUrl,
        category: { connect: { id: category.id } },
        images: {
          create: [{ url: imageUrl, sortOrder: 0 }],
        },
      },
    });

    createdProducts += 1;
  }

  console.log(`Catalog ready: ${categories.length} categories ensured, ${createdProducts} products created, ${skippedProducts} products already existed.`);
}

main()
  .catch((error) => {
    console.error("Catalog seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });