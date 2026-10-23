import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/catalog';
import { getInstagramDMLink } from '@/utils/contactUtils';

function PriceLabel({ product }) {
  const label = String(product.priceLabel || '').trim();
  const match = label.match(/^(\s*₹?\s*[\d,]+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return <span>{label || formatPrice(product.price)}</span>;
  }

  return (
    <>
      <span>{match[1].trim()}</span>
      {match[2] ? <span className="ml-1 text-xs font-normal text-muted-foreground">{match[2]}</span> : null}
    </>
  );
}

function ProductCard({ product }) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const productPath = product?.category?.slug && product?.slug
    ? `/products/${product.category.slug}/${product.slug}`
    : '/products';

  const handleOrderNow = () => {
    window.open(getInstagramDMLink(), '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300">
        <Link to={productPath} className="relative block overflow-hidden aspect-[4/3]">
          {!isLoaded ? <span className="absolute inset-0 animate-shimmer" aria-hidden="true" /> : null}
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            draggable={false}
            onLoad={() => setIsLoaded(true)}
            className={`no-browser-image-action w-full h-full object-cover group-hover:scale-110 group-active:scale-110 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </Link>
        <CardHeader className="p-4">
          <Link to={productPath}>
            <CardTitle className="text-lg font-semibold transition-colors hover:text-primary" style={{ letterSpacing: '-0.01em' }}>
              {product.name}
            </CardTitle>
          </Link>
          <CardDescription
            className="text-sm leading-relaxed"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </CardDescription>
          {Number(product.originalPrice) > Number(product.price) ? (
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-foreground"><PriceLabel product={product} /></p>
                <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
              </div>
              <p className="mt-0.5 text-xs font-bold text-primary">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </p>
            </div>
          ) : (
            <p className="pt-1 text-base font-bold text-foreground"><PriceLabel product={product} /></p>
          )}
        </CardHeader>
        <CardFooter className="mt-auto p-4 pt-0">
          <Button
            onClick={handleOrderNow}
            className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
          >
            <Instagram className="w-4 h-4 mr-2" />
            Order Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ProductCard;
