import Link from "next/link";
import { getCategories, getHomePageSettings, getProducts } from "@/lib/api";
import HomeProductSearch from "@/components/HomeProductSearch";
import { Category, Product } from "@/types/product";

function BoltIcon() {
  return <span aria-hidden="true" className="bolt-icon">ϟ</span>;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 9h13M10 4l5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ReturnsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8a7 7 0 1 1-1 7" />
      <path d="M6 4v4h4M18 16v4h-4" />
    </svg>
  );
}

function CategoryArrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 9h13M10 4l5 5-5 5" />
    </svg>
  );
}

function getCategoryProduct(category: Category, products: Product[]) {
  return products.find((product) => product.category?.slug === category.slug);
}

function CategorySection({ products, categories }: { products: Product[]; categories: Category[] }) {
  return (
    <section className="category-section" aria-labelledby="category-heading">
      <div className="category-heading-row">
        <div>
          <h2 id="category-heading">Shop by Category</h2>
          <p>Find the perfect pair for every occasion</p>
        </div>
        <Link href="/products" className="category-view-all">View All <CategoryArrow /></Link>
      </div>
      <div className="category-grid">
        {categories.map((category) => {
          const categoryProduct = getCategoryProduct(category, products);
          const categoryImage = categoryProduct?.images?.[0]?.url || categoryProduct?.imageUrl;
          const description = categoryProduct?.description || `Explore our ${category.name.toLowerCase()} collection`;

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="category-card"
            >
              {categoryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={categoryImage} alt={`${category.name} footwear`} />
              ) : (
                <div className="category-image-fallback" aria-hidden="true">{category.name.charAt(0)}</div>
              )}
              <span className="category-overlay" />
              <div className="category-card-content">
                <span className="product-count">{category._count?.products ?? 0} products</span>
                <h3>{category.name}</h3>
                <p>{description}</p>
                <span className="category-shop-link">Shop Now <CategoryArrow /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SneakerIllustration() {
  return (
    <svg className="sneaker-illustration" viewBox="0 0 680 500" role="img" aria-label="Red performance sneaker">
      <defs>
        <linearGradient id="shoe-body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ff5b45" />
          <stop offset="0.48" stopColor="#d7192e" />
          <stop offset="1" stopColor="#840d28" />
        </linearGradient>
        <linearGradient id="shoe-sole" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f7f8fb" />
          <stop offset="1" stopColor="#9da8c0" />
        </linearGradient>
        <linearGradient id="shoe-shadow" x1="0" x2="1">
          <stop offset="0" stopColor="#310817" stopOpacity="0" />
          <stop offset="0.5" stopColor="#2a0715" stopOpacity="0.75" />
          <stop offset="1" stopColor="#310817" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="370" cy="409" rx="252" ry="30" fill="url(#shoe-shadow)" />
      <path d="M126 327c54-7 99-29 135-66 34-35 62-89 91-157l64 12c24 51 54 91 91 120 33 26 81 48 129 63 29 9 43 27 37 48-8 28-61 43-117 43H151c-31 0-51-15-50-34 1-13 10-23 25-29Z" fill="url(#shoe-body)" stroke="#680f27" strokeWidth="5" />
      <path d="M352 104c18 2 46 8 64 12 8 39 17 71 36 97-21 12-45 21-72 26l-84-44c20-35 37-68 56-91Z" fill="#b30f2b" />
      <path d="M320 194c32 26 63 40 104 41 9 0 18-2 28-5 17 22 35 39 57 53l-25 45-188-35-52-43c29-14 53-32 76-56Z" fill="#d92739" opacity="0.9" />
      <path d="M322 193c-6 37-2 69 13 99M349 204c-3 34 4 63 19 90M377 214c-1 28 7 52 20 75" fill="none" stroke="#8e0e2a" strokeWidth="8" strokeLinecap="round" />
      <path d="M345 166c28 15 51 25 79 29M336 187c29 15 57 25 87 29M329 210c31 13 63 21 94 24" fill="none" stroke="#ff9a83" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      <path d="M418 161c33 5 63 8 94 7" fill="none" stroke="#f46a62" strokeWidth="9" strokeLinecap="round" />
      <path d="m454 217 48 22-45 30-35-23Z" fill="#f1f4fb" opacity="0.95" />
      <path d="M473 215c18 13 38 19 62 20" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
      <path d="M161 327c69-9 113-27 154-67 14 28 44 49 87 62 51 16 113 19 178 24 27 2 39 9 41 20-17 13-52 18-91 18H150c-26 0-42-8-42-19 0-15 19-29 53-38Z" fill="url(#shoe-sole)" stroke="#707b99" strokeWidth="4" />
      <path d="M152 365h412M185 383h317" fill="none" stroke="#c2c9d8" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <path d="M385 114c23-30 47-47 75-50 22-2 42 6 51 24 5 11 4 23 1 38-13 2-29 1-46-4l-46 26Z" fill="#801026" />
      <path d="M445 96c21-12 43-18 65-15" fill="none" stroke="#ff684f" strokeWidth="10" strokeLinecap="round" />
      <path d="M480 128c-12 25-22 46-31 69" fill="none" stroke="#f5f7fc" strokeWidth="10" strokeLinecap="round" />
      <text x="401" y="144" fill="#f7bbc0" fontSize="18" fontFamily="Arial" fontWeight="700" transform="rotate(10 401 144)">ZMART</text>
    </svg>
  );
}

export default async function HomePage() {
  const [products, categories, homePageSettings] = await Promise.all([
    getProducts(),
    getCategories(),
    getHomePageSettings(),
  ]);
  const featuredImage = homePageSettings.heroImageUrl || products[0]?.images?.[0]?.url || products[0]?.imageUrl;
  const featuredImageAlt = homePageSettings.heroImageUrl
    ? homePageSettings.heroImageAlt
    : products[0]?.name || "Featured sneaker";

  return (
    <main className="zmart-home">
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="collection-pill"><BoltIcon /> New Collection 2032</div>
            <h1 id="hero-heading">Step Into<br /><span>Your Best</span></h1>
            <p className="hero-description">Premium footwear for every step of your journey. From<br className="desktop-break" /> athletic performance to everyday comfort.</p>
            <div className="hero-actions">
              <Link href="/products" className="primary-button">Shop Now <ArrowIcon /></Link>
              <Link href="/products" className="secondary-button">Browse Categories</Link>
            </div>
            <div className="stats-row" aria-label="ZMart statistics">
              <div><strong>50K<span>+</span></strong><small>Happy Customers</small></div>
              <div><strong>4.9 <em>★</em></strong><small>Average Rating</small></div>
              <div><strong>300<span>+</span></strong><small>Styles Available</small></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured footwear">
            <div className="shoe-card">
              {featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredImage} alt={featuredImageAlt} />
              ) : <SneakerIllustration />}
              <div className="discount-badge"><small>UP TO</small><strong>40%</strong><small>OFF</small></div>
            </div>
            <div className="benefit-card shipping-card"><span className="benefit-icon"><CheckIcon /></span><span><strong>Free Shipping</strong><small>Orders over $75</small></span></div>
            <div className="benefit-card returns-card"><span className="benefit-icon"><ReturnsIcon /></span><span><strong>Easy Returns</strong><small>60-day guarantee</small></span></div>
          </div>
        </div>
        <div className="explore-hint"><span>EXPLORE</span><span className="down-arrow">↓</span></div>
      </section>

      <CategorySection products={products} categories={categories} />

      <section className="catalog-preview" aria-label="Featured products">
        <HomeProductSearch products={products} />
        <Link href="/products" className="catalog-link">View all products →</Link>
      </section>
    </main>
  );
}