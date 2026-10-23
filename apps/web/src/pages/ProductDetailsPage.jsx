import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Instagram } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/catalog';

function PriceLabel({ product }) {
  const label = String(product.priceLabel || '').trim();
  const match = label.match(/^(\s*₹?\s*[\d,]+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return <span>{label || formatPrice(product.price)}</span>;
  }

  return <><span>{match[1].trim()}</span>{match[2] ? <span className="ml-1 text-sm font-normal text-muted-foreground">{match[2]}</span> : null}</>;
}
import { getProduct, getProducts } from '@/lib/api';
import { getInstagramDMLink } from '@/utils/contactUtils';

function ProductDetailsPage() {
  const { categorySlug, productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getProduct(productSlug)
      .then((result) => {
        if (isMounted) {
          setProduct(result.product);
          setIsLoading(false);
        }
      })
      .catch((apiError) => {
        // Fall back to the catalog response for older/stale product links.
        getProducts({ available: true })
          .then((result) => {
            const match = (result.products || []).find((item) => item.slug === productSlug);
            if (!isMounted) return;
            if (match) setProduct(match);
            else setError(apiError.message || 'Unable to load product.');
            setIsLoading(false);
          })
          .catch(() => {
            if (isMounted) {
              setError(apiError.message || 'Unable to load product.');
              setIsLoading(false);
            }
          });
      });

    return () => {
      isMounted = false;
    };
  }, [productSlug]);

  return (
    <>
      <Helmet>
        <title>{product ? `${product.name} - Mini_Uphaarrr` : 'Product - Mini_Uphaarrr'}</title>
        <meta name="description" content={product?.description || 'Mini_Uphaarrr handmade product details.'} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-[2.3rem] md:py-12 lg:py-14 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Link to={`/products/${categorySlug}`}>
                <Button variant="ghost" className="mb-5 px-0 hover:bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to category
                </Button>
              </Link>

              {error ? (
                <p className="text-sm text-muted-foreground">{error}</p>
              ) : null}

              {isLoading ? (
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start" aria-label="Loading product">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => <div key={index} className="aspect-square rounded-lg animate-shimmer" />)}
                  </div>
                  <div className="space-y-5 lg:pt-4">
                    <div className="h-4 w-28 rounded-full animate-shimmer" />
                    <div className="h-12 w-4/5 rounded-xl animate-shimmer" />
                    <div className="h-6 w-32 rounded-full animate-shimmer" />
                    <div className="h-5 w-full rounded-full animate-shimmer" />
                    <div className="h-5 w-5/6 rounded-full animate-shimmer" />
                    <div className="h-12 w-48 rounded-xl animate-shimmer" />
                  </div>
                </div>
              ) : product ? (
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(product.images || [product.image]).filter(Boolean).map((image) => (
                      <div key={image} className="overflow-hidden rounded-lg bg-muted shadow-sm">
                        <img
                          src={image}
                          alt={product.name}
                          draggable={false}
                          className="no-browser-image-action h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="lg:sticky lg:top-24">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      {product.category?.name}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}>
                      {product.name}
                    </h1>
                    <div className="mb-4 flex items-center gap-3"><p className="text-xl font-semibold"><PriceLabel product={product} /></p>{Number(product.originalPrice) > Number(product.price) ? <><p className="text-base text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p><span className="text-sm font-semibold text-primary">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span></> : null}</div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <Button
                      onClick={() => window.open(getInstagramDMLink(), '_blank')}
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      Order on Instagram
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default ProductDetailsPage;
