import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CategoryCard from '@/components/CategoryCard.jsx';
import { getCategories } from '@/lib/api';

function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getCategories()
      .then((result) => {
        if (isMounted) {
          setCategories(result.categories || []);
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || 'Unable to load categories.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Products - Mini_Uphaarrr</title>
        <meta name="description" content="Browse handmade gift categories including customized bouquets, chocolate hampers, greeting cards, and personalized decorations." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-[2.3rem] md:py-12 lg:py-14 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 md:mb-8"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Product categories
                </h1>
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  Start with a category, then choose the handmade creation you want to personalize.
                </p>
              </motion.div>

              {error ? (
                <p className="text-sm text-muted-foreground">{error}</p>
              ) : null}

              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-x-6">
                {categories.map((category, index) => (
                  <CategoryCard key={category.id} category={category} index={index} />
                ))}
              </div>

              {!error && categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Categories will appear here after the catalog is seeded.
                </p>
              ) : null}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ProductsPage;
