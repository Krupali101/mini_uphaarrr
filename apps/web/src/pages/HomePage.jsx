import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Circle, Crown, Gem, Gift, Heart, Instagram, Palette, Share2, ShoppingBag, Smile, Sparkles, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import AnnouncementBar from '@/components/AnnouncementBar.jsx';
import Footer from '@/components/Footer.jsx';
import CategoryCard from '@/components/CategoryCard.jsx';
import ReviewCard from '@/components/ReviewCard.jsx';
import { getBanners, getCategories, getProducts, getTestimonials } from '@/lib/api';
import { formatPrice, sortProductsByPosition } from '@/lib/catalog';
import { testimonials } from '@/constants/testimonialsData';

const instagramUrl = 'https://www.instagram.com/mini_.uphaarrr';

const quizSteps = [
  {
    title: 'Who is this gift for?',
    subtitle: 'Help us narrow down the perfect choice.',
    key: 'recipient',
    options: [
      { label: 'My Partner', icon: Heart },
      { label: 'My Parents', icon: User },
      { label: 'A Friend', icon: Smile },
      { label: 'Myself!', icon: Gift },
    ],
  },
  {
    title: 'What is the vibe?',
    subtitle: 'Think about their personality.',
    key: 'vibe',
    options: [
      { label: 'Elegant & Classic', icon: Sparkles },
      { label: 'Fun & Playful', icon: Palette },
      { label: 'Romantic & Soft', icon: Heart },
      { label: 'Minimalist & Clean', icon: Circle },
    ],
  },
  {
    title: 'What is your budget?',
    subtitle: 'We have beautiful gifts at every price.',
    key: 'budget',
    options: [
      { label: 'Value (Under ₹500)', icon: ShoppingBag },
      { label: 'Premium (₹500 - ₹1,000)', icon: Gem },
      { label: 'Luxury (Above ₹1,000)', icon: Crown },
    ],
  },
];

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [catalogError, setCatalogError] = useState('');
  const [customerTestimonials, setCustomerTestimonials] = useState(testimonials);
  const [testimonialOffset, setTestimonialOffset] = useState(0);

  const galleryPreview = [
    { url: '/images/gallery-website-23.jpg', alt: 'Customized photo frame with family photos' },
    { url: '/images/gallery-website-6.webp', alt: 'Handcrafted bouquet with sweets and soft toy' },
    { url: '/images/gallery-website-10.webp', alt: 'Handmade candy greeting cards' },
    { url: '/images/gallery-website-18.jpg', alt: 'Lighted personalized photo frame gift' }
  ];
  const instagramFallbackImages = [
    { url: '/images/product-customized-gift-bouquet.webp', alt: 'Customized handmade gift bouquet' },
    { url: '/images/home-black-luxury-chocolate-bouquet.png', alt: 'Luxury chocolate bouquet' },
    { url: '/images/home-handmade-greeting-cards-collection.jpg', alt: 'Handmade greeting cards collection' },
    { url: '/images/product-customized-photo-frame.jpg', alt: 'Customized photo frame gift' },
    { url: '/images/product-pink-lily-bouquet.webp', alt: 'Pink lily bouquet gift' },
  ];

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCategories(),
      getProducts({ available: true }),
      getBanners(),
      getTestimonials().catch(() => ({ testimonials: [] })),
    ])
      .then(([categoryResult, productResult, bannerResult, testimonialResult]) => {
        if (!isMounted) {
          return;
        }

        setCategories((categoryResult.categories || []).filter((category) => !category.parentId));
        setFeaturedProducts(sortProductsByPosition(productResult.products || []));
        setBanners(bannerResult.banners || []);
        if (testimonialResult.testimonials?.length) setCustomerTestimonials(testimonialResult.testimonials);
      })
      .catch((error) => {
        if (isMounted) {
          setCatalogError(error.message || 'Unable to load catalog.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (customerTestimonials.length <= 4) return undefined;
    const timer = window.setInterval(() => setTestimonialOffset((current) => (current + 1) % customerTestimonials.length), 4500);
    return () => window.clearInterval(timer);
  }, [customerTestimonials.length]);

  useEffect(() => {
    if (banners.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveBannerIndex((current) => (current + 1) % banners.length);
    }, 9000);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (activeBannerIndex >= banners.length) {
      setActiveBannerIndex(0);
    }
  }, [activeBannerIndex, banners.length]);

  const activeBanner = banners[activeBannerIndex];
  const instagramImages = featuredProducts.length > 0
    ? featuredProducts.slice(0, 5).map((product) => ({
      url: product.image || product.images?.[0] || '/images/mini-uphaarrr-logo.png',
      alt: product.name,
    }))
    : instagramFallbackImages;
  const fallbackQuizProducts = [
    {
      id: 'fallback-bouquet',
      name: 'Customized Gift Bouquet',
      price: 499,
      image: '/images/product-customized-gift-bouquet.webp',
    },
    {
      id: 'fallback-chocolate',
      name: 'Black Luxury Chocolate Bouquet',
      price: 799,
      image: '/images/home-black-luxury-chocolate-bouquet.png',
    },
    {
      id: 'fallback-cards',
      name: 'Handmade Greeting Cards',
      price: 1299,
      image: '/images/home-handmade-greeting-cards-collection.jpg',
    },
  ];
  const allQuizProducts = featuredProducts.length > 0 ? featuredProducts : fallbackQuizProducts;
  const selectedBudget = quizAnswers.budget || '';
  const budgetMatches = allQuizProducts.filter((product) => {
    const price = Number(product.price || 0);

    if (/under/i.test(selectedBudget)) {
      return price > 0 && price < 500;
    }

    if (selectedBudget.includes('₹500') || /500/.test(selectedBudget)) {
      return price >= 500 && price <= 1000;
    }

    if (/above/i.test(selectedBudget)) {
      return price > 1000 || price === 0;
    }

    return true;
  });
  const uniqueProducts = (items) => items.filter((product, index, list) => product?.id && list.findIndex((item) => item.id === product.id) === index);
  const quizProducts = uniqueProducts(selectedBudget ? budgetMatches : allQuizProducts).slice(0, 3);
  const currentQuizStep = quizSteps[quizStep];
  const isQuizComplete = quizStep >= quizSteps.length;
  const goToPreviousBanner = () => {
    setActiveBannerIndex((current) => (current === 0 ? banners.length - 1 : current - 1));
  };
  const goToNextBanner = () => {
    setActiveBannerIndex((current) => (current + 1) % banners.length);
  };
  const openQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setIsQuizOpen(true);
  };
  const closeQuiz = () => {
    setIsQuizOpen(false);
  };
  const selectQuizOption = (option) => {
    setQuizAnswers((current) => ({
      ...current,
      [currentQuizStep.key]: option.label,
    }));
    setQuizStep((current) => current + 1);
  };
  const restartQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
  };
  const shareQuizShortlist = () => {
    const text = `Mini_Uphaarrr gift picks for ${quizAnswers.recipient || 'someone special'}: ${quizProducts.map((product) => product.name).join(', ')}`;

    if (navigator.share) {
      navigator.share({ title: 'Mini_Uphaarrr Gift Picks', text, url: window.location.href }).catch(() => {});
      return;
    }

    navigator.clipboard?.writeText(text);
  };

  return (
    <>
      <Helmet>
        <title>Mini_Uphaarrr - Handmade Gifts & Customized Creations</title>
        <meta name="description" content="Discover unique handmade gifts, customized bouquets, chocolate hampers, and personalized decorations. Handmade with love, customized just for you." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />

        <main className="flex flex-1 flex-col">
          <section className={`hero-banner-shell relative overflow-hidden ${activeBanner ? 'min-h-[180px] bg-background sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px]' : 'bg-gradient-to-br from-primary/10 via-background to-secondary/10'}`}>
            {activeBanner ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeBanner.id || activeBanner.image}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {activeBanner.link ? (
                    activeBanner.link.startsWith('/') ? (
                      <Link to={activeBanner.link} className="absolute inset-0">
                        <img
                          src={activeBanner.image}
                          alt={activeBanner.title || 'Mini Uphaarrr homepage banner'}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </Link>
                    ) : (
                      <a href={activeBanner.link} className="absolute inset-0">
                        <img
                          src={activeBanner.image}
                          alt={activeBanner.title || 'Mini Uphaarrr homepage banner'}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </a>
                    )
                  ) : (
                    <img
                      src={activeBanner.image}
                      alt={activeBanner.title || 'Mini Uphaarrr homepage banner'}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            ) : null}
            <div className={`container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${activeBanner ? 'flex min-h-[180px] items-end justify-center pb-4 sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px]' : 'py-[2.3rem] md:py-12 lg:py-14'}`}>
              {!activeBanner ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl"
                >
                  <div className="max-w-3xl text-left">
                    <h1 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                      <span className="text-primary">
                        Handmade gifts,
                      </span>
                      <span className="block mt-2">
                        customized for every moment
                      </span>
                    </h1>

                    <p className="mt-4 md:mt-6 text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                      Customized bouquets, chocolate hampers, surprise gift boxes, photo frames, and handmade cards crafted to make birthdays, anniversaries, and little surprises feel personal.
                    </p>
                  </div>
                </motion.div>
              ) : null}
              {banners.length > 1 ? (
                <div className="flex items-center gap-3 rounded-full bg-background/80 px-3 py-2 shadow-sm">
                  <Button type="button" variant="outline" size="icon" className="rounded-full bg-background/80" onClick={goToPreviousBanner} aria-label="Previous banner">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    {banners.map((banner, index) => (
                      <button
                        key={banner.id}
                        type="button"
                        aria-label={`Show banner ${index + 1}`}
                        onClick={() => setActiveBannerIndex(index)}
                        className={`h-2.5 w-2.5 rounded-full transition ${index === activeBannerIndex ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                      />
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="icon" className="rounded-full bg-background/80" onClick={goToNextBanner} aria-label="Next banner">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          </section>

          <section className="pt-[2.3rem] pb-10 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-left mb-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Shop by category
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Choose a gifting style, then explore creations made for that moment
                </p>
              </motion.div>

              {catalogError ? (
                <p className="text-sm text-muted-foreground">{catalogError}</p>
              ) : null}

              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-6">
                {categories.map((category, index) => (
                  <CategoryCard key={category.id} category={category} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="order-1 py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-3xl text-center"
              >
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-5 inline-flex items-center gap-3 text-base text-muted-foreground transition hover:text-primary"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 text-white shadow-sm">
                    <Instagram className="h-6 w-6" />
                  </span>
                  <span>@mini_.uphaarrr</span>
                </a>
                <h2 className="text-4xl font-bold md:text-5xl" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Follow Our Journey
                </h2>
                <p className="mt-4 text-base text-muted-foreground md:text-lg">
                  Tag us in your unboxing videos and get featured! Use #MiniUphaarrr
                </p>
              </motion.div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                {instagramImages.map((image, index) => (
                  <motion.a
                    key={`${image.url}-${index}`}
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="group aspect-square overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      loading="lazy"
                      draggable={false}
                      className="no-browser-image-action h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
                    />
                  </motion.a>
                ))}
              </div>

              <div className="mt-9 text-center">
                <a href={instagramUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="lg" className="rounded-xl border-primary/20 px-7 transition-all duration-200 active:scale-[0.98]">
                    <Instagram className="mr-2 h-5 w-5" />
                    Follow on Instagram
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </section>

          <section className="order-4 border-y border-primary/10 bg-[#eee7ee] pt-8 pb-10 md:pt-10 md:pb-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 md:mb-8"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  What our customers say
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Real stories from people who made their moments special with Mini_Uphaarrr
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: Math.min(4, customerTestimonials.length) }, (_, index) => customerTestimonials[(testimonialOffset + index) % customerTestimonials.length]).map((testimonial, index) => (
                  <ReviewCard key={testimonial.id} testimonial={testimonial} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="order-3 py-10 md:py-14 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6 md:mb-8"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                  Gallery highlights
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  A glimpse into our handcrafted creations
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryPreview.map((image, index) => (
                  <motion.div
                    key={image.url}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="group aspect-square overflow-hidden rounded-lg bg-muted shadow-sm"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      loading="lazy"
                      draggable={false}
                      className="no-browser-image-action h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-7 md:mt-9">
                <Link to="/gallery">
                  <Button variant="outline" size="lg" className="transition-all duration-200 active:scale-[0.98]">
                    View Full Gallery
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="order-2 py-10 md:py-14 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="gift-quiz-banner overflow-hidden rounded-[2rem] bg-[linear-gradient(115deg,#e9a0b7_0%,#c96f92_48%,#8e456b_100%)] px-6 py-8 text-white shadow-xl md:px-10 md:py-11"
              >
                <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12">
                        <Gift className="h-7 w-7" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.35em] text-white/85">Gift Finder</span>
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a405c]">
                        Popular
                      </span>
                    </div>
                    <h2 className="max-w-2xl text-4xl font-bold md:text-5xl" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                      Not sure what to buy?
                    </h2>
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
                      Answer 3 quick questions and we'll suggest the perfect handmade gift.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-4 md:items-end">
                    <Button
                      type="button"
                      size="lg"
                      onClick={openQuiz}
                      className="rounded-2xl bg-[#d87998] px-8 py-6 text-base font-bold text-white hover:bg-[#c96889]"
                    >
                      Start Gift Quiz
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                    <Link to="/products" className="text-xs font-bold uppercase tracking-[0.35em] text-white/70 transition hover:text-white">
                      Or browse all products
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {isQuizOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#7a4055]/20 px-4 py-6 backdrop-blur-sm">
              <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-[#f3c7d3] bg-[#fffafb] p-5 shadow-2xl sm:p-8 md:p-12">
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-[#fbe1e8]">
                  <div
                    className="h-full bg-[#d87998] transition-all duration-300"
                    style={{ width: `${Math.min((quizStep / quizSteps.length) * 100, 100)}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={closeQuiz}
                  aria-label="Close gift quiz"
                  className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/15"
                >
                  <X className="h-5 w-5" />
                </button>

                {!isQuizComplete ? (
                  <>
                    <div className="mx-auto max-w-2xl text-center">
                      <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Gift className="h-8 w-8" />
                      </span>
                      <h2 className="text-3xl font-bold md:text-5xl" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                        {currentQuizStep.title}
                      </h2>
                      <p className="mt-3 text-base text-muted-foreground md:text-lg">{currentQuizStep.subtitle}</p>
                    </div>

                    <div className="mt-9 grid gap-4 md:grid-cols-2">
                      {currentQuizStep.options.map((option) => {
                        const Icon = option.icon;

                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => selectQuizOption(option)}
                            className="flex min-h-24 items-center gap-5 rounded-2xl border border-primary/20 bg-background px-6 py-5 text-left text-lg font-semibold shadow-sm transition hover:border-primary/45 hover:bg-primary/5"
                          >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                              <Icon className="h-6 w-6" />
                            </span>
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto max-w-3xl text-center">
                      <h2 className="text-3xl font-bold md:text-5xl" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                        Perfect Matches Found!
                      </h2>
                      <p className="mt-3 text-base text-muted-foreground md:text-lg">
                        Based on your answers, we think they will love these:
                      </p>
                    </div>

                    <div className="mt-9 grid gap-5 md:grid-cols-3">
                      {quizProducts.map((product) => {
                        const productPath = product?.category?.slug && product?.slug
                          ? `/products/${product.category.slug}/${product.slug}`
                          : '/products';

                        return (
                          <div key={product.id} className="overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm">
                            <Link to={productPath} onClick={closeQuiz} className="block aspect-square overflow-hidden bg-muted">
                              <img
                                src={product.image || product.images?.[0] || '/images/mini-uphaarrr-logo.png'}
                                alt={product.name}
                                draggable={false}
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </Link>
                            <div className="p-4">
                              <p className="truncate text-sm font-semibold">{product.name}</p>
                              <p className="mt-1 text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                              <Link to={productPath} onClick={closeQuiz}>
                                <Button className="mt-4 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                                  <ShoppingBag className="mr-2 h-4 w-4" />
                                  View Gift
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 grid gap-3 md:grid-cols-3">
                      <Link to="/products" onClick={closeQuiz}>
                        <Button size="lg" className="w-full rounded-2xl bg-primary px-7 text-primary-foreground hover:bg-primary/90">
                          Shop My Picks
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Button type="button" variant="outline" size="lg" onClick={shareQuizShortlist} className="rounded-2xl border-primary/20 text-primary hover:bg-primary/5">
                        Share Shortlist
                        <Share2 className="ml-2 h-5 w-5" />
                      </Button>
                      <Button type="button" variant="outline" size="lg" onClick={restartQuiz} className="rounded-2xl border-primary/20 text-primary hover:bg-primary/5">
                        Restart Quiz
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </main>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
