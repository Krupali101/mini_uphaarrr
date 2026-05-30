import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getInstagramDMLink } from '@/utils/contactUtils';

function ProductCard({ product }) {
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
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            draggable={false}
            className="no-browser-image-action w-full h-full object-cover group-hover:scale-110 group-active:scale-110 transition-transform duration-500"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-semibold" style={{ letterSpacing: '-0.01em' }}>
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <Button
            onClick={handleOrderNow}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
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
