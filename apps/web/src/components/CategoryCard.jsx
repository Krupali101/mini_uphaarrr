import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function CategoryCard({ category, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="min-w-0"
    >
      <Link
        to={`/products/${category.slug}`}
        className="group relative mx-auto flex min-h-[15rem] max-w-[14rem] flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-b from-card to-secondary/30 p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl"
      >
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-primary opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
        <span className="block h-[7.25rem] w-[7.25rem] overflow-hidden rounded-full border-4 border-background bg-muted shadow-md ring-1 ring-primary/20 transition-all duration-500 group-hover:scale-105 group-hover:ring-4 group-hover:ring-primary/20 sm:h-32 sm:w-32 md:h-36 md:w-36">
          <img
            src={category.image}
            alt={category.name}
            draggable={false}
            className="no-browser-image-action h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
          />
        </span>
        <span className="max-w-[11rem] text-sm font-semibold leading-snug text-foreground sm:text-base">
          {category.name}
        </span>
      </Link>
    </motion.div>
  );
}

export default CategoryCard;
