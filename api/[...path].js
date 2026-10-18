const { announcementsCollectionHandler, announcementItemHandler } = require('./_lib/announcementsHandler');
const { bannersCollectionHandler, bannerItemHandler } = require('./_lib/bannersHandler');
const { categoriesCollectionHandler, categoryItemHandler } = require('./_lib/categoriesHandler');
const { galleryCollectionHandler, galleryItemHandler } = require('./_lib/galleryHandler');
const { productsCollectionHandler, productItemHandler } = require('./_lib/productsHandler');
const { collection: testimonialsCollectionHandler, item: testimonialItemHandler } = require('./_lib/testimonialsHandler');
const uploadImagesHandler = require('./_lib/cloudinaryHandler');
const sendEmailHandler = require('../api-legacy/send-email');

function getPath(req) {
  const value = req.query?.path;
  let rawPath = value;
  if (!rawPath && req.url) {
    rawPath = req.url.split('?')[0].replace(/^\/api\/?/, '');
  }
  const parts = Array.isArray(rawPath) ? rawPath : String(rawPath || '').split('/');
  return parts.filter(Boolean);
}

module.exports = async (req, res) => {
  const [resource, id] = getPath(req);
  if (id) {
    req.query = { ...(req.query || {}), id };
  }

  const handlers = {
    announcements: [announcementsCollectionHandler, announcementItemHandler],
    announcement: [announcementsCollectionHandler, announcementItemHandler],
    banners: [bannersCollectionHandler, bannerItemHandler],
    categories: [categoriesCollectionHandler, categoryItemHandler],
    gallery: [galleryCollectionHandler, galleryItemHandler],
    products: [productsCollectionHandler, productItemHandler],
    testimonials: [testimonialsCollectionHandler, testimonialItemHandler],
  };

  if (resource === 'upload-images') return uploadImagesHandler(req, res);
  if (resource === 'send-email') return sendEmailHandler(req, res);

  const selected = handlers[resource];
  if (!selected) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'API route not found.' }));
    return;
  }

  return (id ? selected[1] : selected[0])(req, res);
};
