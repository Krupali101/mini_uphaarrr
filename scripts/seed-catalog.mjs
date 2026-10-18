import 'dotenv/config';
import { createRequire } from 'node:module';
import { productCategories, featuredProducts } from '../apps/web/src/constants/productsData.js';

const require = createRequire(import.meta.url);
const connectDB = require('../api/_lib/db');
const { Category, Product } = require('../api/_lib/models');
const slugify = require('../api/_lib/slug');

function getFeaturedImage(productName) {
  const featured = featuredProducts.find((item) => item.name === productName);
  return featured?.image;
}

async function seed() {
  await connectDB();

  const categoryMap = new Map();

  for (const category of productCategories) {
    const slug = slugify(category.name);
    const savedCategory = await Category.findOneAndUpdate(
      { slug },
      {
        name: category.name,
        slug,
        image: category.image,
        description: category.description,
      },
      {
        returnDocument: 'after',
        runValidators: true,
        upsert: true,
      }
    );

    categoryMap.set(category.name, savedCategory);
  }

  for (const category of productCategories) {
    const savedCategory = categoryMap.get(category.name);

    for (const product of category.products) {
      const featuredImage = getFeaturedImage(product.name);
      const images = [featuredImage || product.image, product.image].filter(Boolean);
      const uniqueImages = [...new Set(images)];

      await Product.findOneAndUpdate(
        { slug: slugify(product.name) },
        {
          name: product.name,
          slug: slugify(product.name),
          category: savedCategory._id,
          description: product.description,
          price: 0,
          images: uniqueImages,
          featured: featuredProducts.some((item) => item.name === product.name),
          available: true,
        },
        {
          returnDocument: 'after',
          runValidators: true,
          upsert: true,
        }
      );
    }
  }

  const categoryCount = await Category.countDocuments();
  const productCount = await Product.countDocuments();

  console.log(`Seed complete: ${categoryCount} categories, ${productCount} products.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
