import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

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

              <div className="columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={image}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.025 }}
                    className="break-inside-avoid overflow-hidden rounded-lg bg-muted shadow-sm"
                  >
                    <img
                      src={`/images/gallery/${image}`}
                      alt={`Mini Uphaarrr handmade creation ${index + 1}`}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
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
