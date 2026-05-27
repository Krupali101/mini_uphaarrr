import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Made with love',
      description: 'Every creation is handcrafted with genuine care and attention to detail'
    },
    {
      icon: Sparkles,
      title: 'Uniquely personalized',
      description: 'Each gift is customized to match your vision and make your moment special'
    },
    {
      icon: Gift,
      title: 'Quality craftsmanship',
      description: 'We use premium materials and techniques to ensure lasting beauty'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Mini_Uphaarrr</title>
        <meta name="description" content="Learn about Mini_Uphaarrr's story, mission, and values. We create unique handmade gifts designed with creativity, elegance, and love." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-10 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-14 items-center max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 md:mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Thoughtful handmade gifting</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-5" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                    About Mini_Uphaarrr
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5 md:mb-8">
                    We create personalized gifts, surprise boxes, bouquets, and keepsakes that feel warm, detailed, and made especially for your moment.
                  </p>
                  <div className="space-y-3 md:space-y-4 text-sm md:text-base leading-relaxed text-foreground/90 mb-6 md:mb-8">
                    <p>
                      Mini_Uphaarrr began with a love for turning simple ideas into memorable handmade gifts. Every order is planned around the person receiving it, from the colors and wrapping to the small details that make it feel personal.
                    </p>
                    <p>
                      Whether it is a birthday, anniversary, thank-you gift, or just a sweet surprise, our goal is to make the giving feel as special as the celebration.
                    </p>
                    <p>
                      From customized bouquets to handmade greeting cards, chocolate hampers, photo frames, and personalized decorations, each piece we create carries the warmth of handcrafted love. We listen to the occasion, the recipient, and the little preferences that make a gift feel truly yours.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="relative"
                >
                  <img
                    src="/images/about-h-19.jpg"
                    alt="Handmade gift creation by Mini_Uphaarrr"
                    className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-10 md:py-20 bg-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 md:mb-12"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Our values
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  The principles that guide every creation we make
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                      <CardContent className="pt-5 pb-4 md:pt-8 md:pb-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                          <value.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-10 md:py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Our mission
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-foreground/90 mb-6 md:mb-8">
                  To create beautiful, personalized gifts that celebrate life's special moments and bring joy to both the giver and receiver. We're committed to quality craftsmanship, creative design, and making every celebration unforgettable.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://www.instagram.com/mini_.uphaarrr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]">
                      <Instagram className="w-5 h-5 mr-2" />
                      Follow Our Journey
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default AboutPage;
