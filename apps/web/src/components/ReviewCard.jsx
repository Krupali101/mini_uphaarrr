import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function ReviewCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full bg-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex gap-1 mb-3">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {testimonial.occasion}
          </p>
        </CardHeader>
        <CardContent>
          <blockquote className="text-base leading-relaxed mb-4 italic">
            "{testimonial.review}"
          </blockquote>
          <p className="font-semibold text-foreground">
            {testimonial.name}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ReviewCard;