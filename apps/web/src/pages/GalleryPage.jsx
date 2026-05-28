import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

function GalleryItem({ image, index }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '80px' }}
      transition={{ duration: 0.45, delay: Math.min((index % 8) * 0.035, 0.18), ease: 'easeOut' }}
      className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted shadow-sm"
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
      )}
      <img
        src={`/images/gallery/${image}`}
        alt={`Mini Uphaarrr handmade creation ${index + 1}`}
        loading="lazy"
        decoding="async"
        fetchPriority={index < 6 ? 'high' : 'low'}
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-[1.03]'
        }`}
      />
    </motion.div>
  );
}

function GalleryPage() {
  const galleryImages = [
    '0.png',
    '00.jpg',
    '6.webp',
    '7.webp',
    '08.png',
    '8.webp',
    '19.jpg',
    '10.webp',
    '11.webp',
    '12.png',
    '12.webp',
    '13.png',
    '13.webp',
    '14.png',
    '14.webp',
    '15.webp',
    '16.jpg',
    '17.jpg',
    '18.jpg',
    'ca5bc64532d31bdc1d5007f5720c9d2b.jpg',
    'h_00.jpg',
    'h_2.jpg',
    'h_18.jpg',
    'h_13.jpg',
    'h_14.jpg',
    'h_15.jpg',
    'h_17.jpg',
    'h_7.jpg',
    'h_6.jpg',
    'a7636a82a8c8e8104eaf12cec641db9e.jpg',
    '61d3e071-65a1-4b77-840b-453dac9095ca.png',
    '48142d3906dec6222c42722e75e4d375.jpg',
    '0a7422d7-10ca-49dd-b16d-e291cd8a8446.png',
    'ChatGPT Image May 28, 2026, 08_41_55 PM.png'
  ];
  const [visibleCount, setVisibleCount] = useState(8);
  const visibleImages = galleryImages.slice(0, visibleCount);

  useEffect(() => {
    if (visibleCount >= galleryImages.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setVisibleCount((currentCount) => Math.min(currentCount + 4, galleryImages.length));
    }, 220);

    return () => window.clearTimeout(timer);
  }, [galleryImages.length, visibleCount]);

  return (
    <>
      <Helmet>
        <title>Gallery - Mini_Uphaarrr</title>
        <meta name="description" content="Browse our gallery of handmade creations including bouquets, chocolate hampers, greeting cards, and personalized gifts." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-8 md:py-12 lg:py-14 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 md:mb-8"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Our creations gallery
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Explore our handcrafted gifts and personalized creations, each made with love and attention to detail
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {visibleImages.map((image, index) => (
                  <GalleryItem key={image} image={image} index={index} />
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default GalleryPage;
