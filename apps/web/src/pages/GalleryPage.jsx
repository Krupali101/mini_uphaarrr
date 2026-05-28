import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const galleryImageAspects = {
  '0.png': '1086 / 1448',
  '00.jpg': '735 / 980',
  '08.png': '1086 / 1448',
  '12.png': '1086 / 1448',
  '13.png': '1024 / 1536',
  '14.png': '1086 / 1448',
  '16.jpg': '736 / 981',
  '17.jpg': '1200 / 1598',
  '18.jpg': '1 / 1',
  '19.jpg': '736 / 864',
  'ca5bc64532d31bdc1d5007f5720c9d2b.jpg': '1 / 1',
  'h_00.jpg': '1200 / 1500',
  'h_2.jpg': '735 / 937',
  'h_18.jpg': '736 / 981',
  'h_13.jpg': '736 / 1104',
  'h_14.jpg': '736 / 1104',
  'h_15.jpg': '736 / 977',
  'h_17.jpg': '736 / 1104',
  'h_7.jpg': '1200 / 1600',
  'h_6.jpg': '736 / 912',
  'a7636a82a8c8e8104eaf12cec641db9e.jpg': '1 / 1',
  '61d3e071-65a1-4b77-840b-453dac9095ca.png': '974 / 1615',
  '48142d3906dec6222c42722e75e4d375.jpg': '1016 / 1200',
  '0a7422d7-10ca-49dd-b16d-e291cd8a8446.png': '1055 / 1490',
  'ChatGPT Image May 28, 2026, 08_41_55 PM.png': '1086 / 1448'
};

function GalleryItem({ image, index }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative mb-3 break-inside-avoid overflow-hidden rounded-lg bg-muted shadow-sm transform-gpu sm:mb-4"
      style={{ aspectRatio: galleryImageAspects[image] || '4 / 5' }}
    >
      <div
        className={`absolute inset-0 bg-muted transition-opacity duration-700 ease-out ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        src={`/images/gallery/${image}`}
        alt={`Mini Uphaarrr handmade creation ${index + 1}`}
        loading="lazy"
        decoding="async"
        fetchPriority={index < 6 ? 'high' : 'low'}
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transform-gpu transition-all ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.01]'
        }`}
        style={{
          transitionDelay: `${Math.min((index % 8) * 45, 260)}ms`,
          transitionDuration: '1200ms'
        }}
      />
    </div>
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

              <div className="columns-2 gap-3 space-y-3 sm:gap-4 sm:space-y-4 lg:columns-3 xl:columns-4">
                {galleryImages.map((image, index) => (
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
