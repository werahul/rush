import Link from 'next/link';
import { ProductGrid } from '@/components/product/product-grid';
import { HomeHero } from '@/components/home/home-hero';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { FadeIn } from '@/components/motion/fade-in';
import { fetchFeaturedProducts, fetchProducts } from '@/lib/products';

export default async function HomePage() {
  const [{ products: featured }, { products: newArrivals }] = await Promise.all([
    fetchFeaturedProducts(),
    fetchProducts({ isNewArrival: true, limit: 4 } as Parameters<typeof fetchProducts>[0]),
  ]);

  const arrivals =
    newArrivals.length > 0
      ? newArrivals.slice(0, 4)
      : (await fetchProducts()).products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <>
      <HomeHero />
      <CategoryShowcase />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <FadeIn className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Curated</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Featured Drops</h2>
          </div>
          <Link href="/products" className="text-xs uppercase tracking-widest transition-opacity hover:opacity-70">
            View all
          </Link>
        </FadeIn>
        <ProductGrid products={featured.slice(0, 4)} />
      </section>

      <section className="relative overflow-hidden bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeIn className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Just In</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">New Arrivals</h2>
            </div>
            <Link href="/products?sort=newest" className="text-xs uppercase tracking-widest transition-opacity hover:opacity-70">
              Shop new
            </Link>
          </FadeIn>
          <ProductGrid products={arrivals} />
        </div>
      </section>
    </>
  );
}
