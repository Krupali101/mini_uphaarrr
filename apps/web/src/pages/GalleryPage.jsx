import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import GalleryImage from '@/components/GalleryImage.jsx';

function GalleryPage() {
  const galleryImages = [
    { url: '/images/home-customized-gift-bouquet.png', alt: 'Customized Gift Bouquet' },
    { url: '/images/home-black-luxury-chocolate-bouquet.png', alt: 'Black Luxury Chocolate Bouquet' },
    { url: '/images/gallery-customized-gift-bouquet-h17.jpg', alt: 'Customized Gift Bouquet' },
    { url: '/images/gallery-customized-gift-bouquet-h1.jpg', alt: 'Customized Gift Bouquet with skincare and jewelry' },
    { url: '/images/gallery-gift-creation-h2.jpg', alt: 'Mini_Uphaarrr handmade gift creation' },
    { url: '/images/gallery-black-luxury-chocolate-bouquet-h7.jpg', alt: 'Black Luxury Chocolate Bouquet with treats and ribbons' },
    { url: '/images/gallery-gift-creation-h15.jpg', alt: 'Mini_Uphaarrr handmade gift creation' },
    { url: '/images/gallery-gift-creation-h13.jpg', alt: 'Mini_Uphaarrr handmade gift creation' },
    { url: '/images/gallery-gift-creation-h14.jpg', alt: 'Mini_Uphaarrr handmade gift creation' },
    { url: '/images/gallery-gift-creation-h18.jpg', alt: 'Mini_Uphaarrr handmade gift creation' },
    { url: '/images/gallery-h-00.jpg', alt: 'Mini_Uphaarrr handmade gift creation' },
    { url: '/images/gallery-pink-gift-box-2-2.jpg', alt: 'Pink Gift Box' },
    { url: '/images/home-handmade-greeting-cards-collection.jpg', alt: 'Handmade Greeting Cards Collection' },
    { url: '/images/home-kinder-joy-bouquet.jpg', alt: 'Kinder Joy Bouquet' },
    { url: '/images/gallery-website-1.webp', alt: 'Mini_Uphaarrr handmade gift creation 1' },
    { url: '/images/gallery-website-2.webp', alt: 'Mini_Uphaarrr handmade gift creation 2' },
    { url: '/images/gallery-website-3.jpg', alt: 'Mini_Uphaarrr handmade gift creation 3' },
    { url: '/images/gallery-website-4.webp', alt: 'Mini_Uphaarrr handmade gift creation 4' },
    { url: '/images/gallery-website-5.webp', alt: 'Mini_Uphaarrr handmade gift creation 5' },
    { url: '/images/gallery-website-6.webp', alt: 'Mini_Uphaarrr handmade gift creation 6' },
    { url: '/images/gallery-website-7.webp', alt: 'Mini_Uphaarrr handmade gift creation 7' },
    { url: '/images/gallery-website-8.webp', alt: 'Mini_Uphaarrr handmade gift creation 8' },
    { url: '/images/gallery-website-9.webp', alt: 'Mini_Uphaarrr handmade gift creation 9' },
    { url: '/images/gallery-website-10.webp', alt: 'Mini_Uphaarrr handmade gift creation 10' },
    { url: '/images/gallery-website-11.webp', alt: 'Mini_Uphaarrr handmade gift creation 11' },
    { url: '/images/gallery-website-12.webp', alt: 'Mini_Uphaarrr handmade gift creation 12' },
    { url: '/images/gallery-website-13.webp', alt: 'Mini_Uphaarrr handmade gift creation 13' },
    { url: '/images/gallery-website-14.webp', alt: 'Mini_Uphaarrr handmade gift creation 14' },
    { url: '/images/gallery-website-15.webp', alt: 'Mini_Uphaarrr handmade gift creation 15' },
    { url: '/images/gallery-website-16.jpg', alt: 'Mini_Uphaarrr handmade gift creation 16' },
    { url: '/images/gallery-website-17.jpg', alt: 'Mini_Uphaarrr handmade gift creation 17' },
    { url: '/images/gallery-website-18.jpg', alt: 'Mini_Uphaarrr handmade gift creation 18' },
    { url: '/images/gallery-website-19.jpg', alt: 'Mini_Uphaarrr handmade gift creation 19' },
    { url: '/images/gallery-website-20.png', alt: 'Mini_Uphaarrr handmade gift creation 20' },
    { url: '/images/gallery-website-21.png', alt: 'Mini_Uphaarrr handmade gift creation 21' },
    { url: '/images/home-pink-gift-box.jpg', alt: 'Pink Gift Box' },
    { url: '/images/product-custom-premium-bouquet.jpg', alt: 'Custom Premium Bouquet' },
    { url: '/images/product-chocolate-hamper.jpg', alt: 'Chocolate Hamper' },
    { url: '/images/product-handmade-greeting-card.jpg', alt: 'Handmade Greeting Card' },
    { url: '/images/product-surprise-gift-box.jpg', alt: 'Surprise Gift Box' },
    { url: '/images/product-luxury-surprise-gift-box.jpg', alt: 'Luxury Surprise Gift Box' },
    { url: '/images/kinder-joy-bouquet.png', alt: 'Kinder Joy Bouquet' }
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
          <section className="py-8 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 md:mb-12"
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
                  <GalleryImage key={image.url} image={image} index={index} />
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
