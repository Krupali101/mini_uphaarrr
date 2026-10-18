const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      maxlength: 140,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      maxlength: 180,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    priceLabel: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    sortOrder: {
      type: Number,
      min: 1,
      default: 9999,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (images) => Array.isArray(images) && images.length > 0,
        message: 'At least one image URL is required.',
      },
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 160,
      default: '',
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    order: {
      type: Number,
      default: 1,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const galleryItemSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 160,
      default: '',
    },
    order: {
      type: Number,
      default: 1,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const announcementSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    link: { type: String, trim: true, maxlength: 1000, default: '' },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  review: { type: String, required: true, trim: true, maxlength: 1000 },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  occasion: { type: String, trim: true, maxlength: 120, default: '' },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema);
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

module.exports = {
  Banner,
  Announcement,
  Testimonial,
  Category,
  GalleryItem,
  Product,
};
