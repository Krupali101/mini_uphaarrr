import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import ReviewCard from '@/components/ReviewCard.jsx';
import GalleryImage from '@/components/GalleryImage.jsx';
import { featuredProducts } from '@/constants/productsData';
import { testimonials } from '@/constants/testimonialsData';

function HomePage() {
  const galleryPreview = [
    { url: '/images/gallery-website-23.jpg', alt: 'Black framed customized photo collage featuring multiple memorable moments' },
    { url: '/images/gallery-website-6.webp', alt: 'Handcrafted gift creation' },
    { url: '/images/gallery-website-10.webp', alt: 'Handcrafted gift creation' },
    { url: '/images/gallery-website-18.jpg', alt: 'Handcrafted gift creation' }
  ];

  return (
    <>
      <Helmet>
        <title>Mini_Uphaarrr - Handmade Gifts & Customized Creations</title>
        <meta name="description" content="Discover unique handmade gifts, customized bouquets, chocolate hampers, and personalized decorations. Handmade with love, customized just for you." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="absolute inset-0 bg-[url('/images/gallery-website-1.webp')] bg-cover bg-center opacity-10" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Handcrafted with Love</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Handmade with love,<br />customized just for you
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                  Discover unique handmade gifts and customized surprise creations designed with creativity, elegance, and love to make your moments unforgettable.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/custom-orders">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-base px-8">
                      Customize Your Gift
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button size="lg" variant="outline" className="transition-all duration-200 active:scale-[0.98] text-base px-8">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="pt-20 pb-10 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Trending creations
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Explore our most loved handmade gifts, carefully crafted to bring joy to your special moments
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/products">
                  <Button variant="outline" size="lg" className="transition-all duration-200 active:scale-[0.98]">
                    View All Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-12 pb-20 bg-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  What our customers say
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Real stories from people who made their moments special with Mini_Uphaarrr
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {testimonials.slice(0, 4).map((testimonial, index) => (
                  <ReviewCard key={testimonial.id} testimonial={testimonial} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Gallery highlights
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  A glimpse into our handcrafted creations
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryPreview.map((image, index) => (
                  <GalleryImage key={index} image={image} index={index} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/gallery">
                  <Button variant="outline" size="lg" className="transition-all duration-200 active:scale-[0.98]">
                    View Full Gallery
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <Gift className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Ready to create something special?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Let us help you design the perfect gift for your loved ones. Every creation is personalized to match your vision and make your celebration unforgettable.
                </p>
                <Link to="/custom-orders">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-base px-8">
                    Start Your Custom Order
                    <Heart className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;