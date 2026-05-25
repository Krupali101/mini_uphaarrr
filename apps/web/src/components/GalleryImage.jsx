import React, { useState } from 'react';
import { motion } from 'framer-motion';

function GalleryImage({ image, index }) {
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-2xl group cursor-pointer bg-muted"
    >
      {hasError ? (
        <div className="flex min-h-64 items-center justify-center p-6 text-center text-sm text-muted-foreground">
          Image unavailable
        </div>
      ) : (
        <>
          <img
            src={image.url}
            alt={image.alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
    </motion.div>
  );
}

export default GalleryImage;
