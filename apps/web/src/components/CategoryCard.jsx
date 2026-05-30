import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function CategoryCard({ category, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/products#${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
        <Card className="h-full overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={category.image}
              alt={category.name}
              draggable={false}
              className="no-browser-image-action w-full h-full object-cover group-hover:scale-110 group-active:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold" style={{ letterSpacing: '-0.01em' }}>
              {category.name}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {category.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}

export default CategoryCard;
