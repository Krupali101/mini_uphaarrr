import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getInstagramDMLink, getProductOrderGmailLink } from '@/utils/contactUtils';
import { openGmailWithThankYou } from '@/utils/gmailFeedback';

function ProductCard({ product }) {
  const handleInstagramOrder = () => {
    window.open(getInstagramDMLink(), '_blank');
  };

  const handleGmailOrder = () => {
    openGmailWithThankYou(getProductOrderGmailLink(product.name), {
      title: 'Thank you for your order request!',
      description: 'Your email app is ready with your product details, and we will contact you soon.'
    });
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
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
        <CardFooter className="mt-auto flex flex-col gap-3">
          <Button
            onClick={handleInstagramOrder}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]"
          >
            <Instagram className="w-4 h-4 mr-2" />
            Order via Instagram
          </Button>
          <Button
            onClick={handleGmailOrder}
            variant="outline"
            className="w-full transition-all duration-200 active:scale-[0.98]"
          >
            <Mail className="w-4 h-4 mr-2" />
            Order via Email
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ProductCard;
