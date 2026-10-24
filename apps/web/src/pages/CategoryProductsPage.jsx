import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import CategoryCard from '@/components/CategoryCard.jsx';
import { Button } from '@/components/ui/button';
import { getCategory, getProducts } from '@/lib/api';
import { sortProductsByPosition } from '@/lib/catalog';

function CategoryProductsPage() {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCategory(categorySlug),
      getProducts({ category: categorySlug, available: true }),
    ])
      .then(([categoryResult, productResult]) => {
        if (!isMounted) {
          return;
        }

        setCategory(categoryResult.category);
        setChildren(categoryResult.children || []);
        setProducts(categoryResult.children?.length ? [] : sortProductsByPosition(productResult.products || []));
        setIsLoading(false);
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || 'Unable to load products.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  return (
    <>
      <Helmet>
        <title>{category ? `${category.name} - Mini_Uphaarrr` : 'Category - Mini_Uphaarrr'}</title>
        <meta name="description" content={category?.description || 'Browse Mini_Uphaarrr handmade products by category.'} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-[2.3rem] md:py-12 lg:py-14 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Link to="/products">
                <Button variant="ghost" className="mb-5 px-0 hover:bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All categories
                </Button>
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 md:mb-8"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  {category?.name || 'Products'}
                </h1>
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {category?.description || 'Explore handmade creations from this category.'}
                </p>
              </motion.div>

              {!isLoading && children.length > 0 ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                  {children.map((child, index) => <CategoryCard key={child.id} category={child} index={index} />)}
                </div>
              ) : null}

              {error ? (
                <p className="text-sm text-muted-foreground">{error}</p>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={`product-skeleton-${index}`} className="overflow-hidden rounded-xl border border-primary/10 bg-card">
                    <div className="aspect-[4/3] animate-shimmer" />
                    <div className="space-y-3 p-4">
                      <div className="h-5 w-4/5 rounded animate-shimmer" />
                      <div className="h-5 w-2/5 rounded animate-shimmer" />
                      <div className="h-10 w-full rounded-lg animate-shimmer" />
                    </div>
                  </div>
                )) : null}
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {!error && products.length === 0 ? (
                <p className="text-sm text-muted-foreground"></p>
              ) : null}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default CategoryProductsPage;
