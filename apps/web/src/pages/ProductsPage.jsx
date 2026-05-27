import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { productCategories } from '@/constants/productsData';

function ProductsPage() {
  return (
    <>
      <Helmet>
        <title>Products - Mini_Uphaarrr</title>
        <meta name="description" content="Browse our collection of handmade gifts including customized bouquets, chocolate hampers, greeting cards, and personalized decorations." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {productCategories.map((category, categoryIndex) => (
            <section
              key={category.id}
              id={category.name.toLowerCase().replace(/\s+/g, '-')}
              className={categoryIndex % 2 === 0 ? 'py-[2.3rem] md:py-12 lg:py-14 bg-background' : 'py-[2.3rem] md:py-12 lg:py-14 bg-muted'}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 md:mb-8"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {category.description}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {category.products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ProductsPage;
