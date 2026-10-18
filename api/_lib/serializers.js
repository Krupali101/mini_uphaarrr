function serializeCategory(category) {
  if (!category) {
    return null;
  }

  const plain = category.toObject ? category.toObject() : category;

  return {
    id: String(plain._id),
    name: plain.name,
    slug: plain.slug,
    image: plain.image,
    description: plain.description,
    parentId: plain.parentId ? String(plain.parentId._id || plain.parentId) : null,
    active: plain.active !== false,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function serializeProduct(product) {
  if (!product) {
    return null;
  }

  const plain = product.toObject ? product.toObject() : product;

  return {
    id: String(plain._id),
    name: plain.name,
    slug: plain.slug,
    category: serializeCategory(plain.category),
    description: plain.description,
    price: plain.price,
    priceLabel: plain.priceLabel || '',
    originalPrice: plain.originalPrice || 0,
    sortOrder: plain.sortOrder || 9999,
    images: plain.images || [],
    image: plain.images?.[0] || '',
    featured: Boolean(plain.featured),
    available: Boolean(plain.available),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function serializeBanner(banner) {
  if (!banner) {
    return null;
  }

  const plain = banner.toObject ? banner.toObject() : banner;

  return {
    id: String(plain._id),
    title: plain.title || '',
    image: plain.image,
    link: plain.link || '',
    order: plain.order || 0,
    active: Boolean(plain.active),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function serializeGalleryItem(item) {
  if (!item) {
    return null;
  }

  const plain = item.toObject ? item.toObject() : item;

  return {
    id: String(plain._id),
    image: plain.image,
    title: plain.title || '',
    order: plain.order || 0,
    active: Boolean(plain.active),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function serializeAnnouncement(announcement) {
  if (!announcement) return null;
  const plain = announcement.toObject ? announcement.toObject() : announcement;
  return { id: String(plain._id), text: plain.text, link: plain.link || '', active: Boolean(plain.active), createdAt: plain.createdAt, updatedAt: plain.updatedAt };
}
function serializeTestimonial(item) {
  if (!item) return null;
  const plain = item.toObject ? item.toObject() : item;
  return { id: String(plain._id), name: plain.name, review: plain.review, rating: plain.rating, occasion: plain.occasion || '', active: Boolean(plain.active) };
}

module.exports = {
  serializeBanner,
  serializeAnnouncement,
  serializeTestimonial,
  serializeCategory,
  serializeGalleryItem,
  serializeProduct,
};
