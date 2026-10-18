const mongoose = require('mongoose');
const requireAdmin = require('./adminAuth');
const connectDB = require('./db');
const { getErrorResponse, methodNotAllowed, readJsonBody, sendJson } = require('./http');
const { Category, Product } = require('./models');
const { serializeProduct } = require('./serializers');
const slugify = require('./slug');

function getId(req) {
  return req.query?.id || req.params?.id;
}

async function resolveCategory(value) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();
  const filter = mongoose.Types.ObjectId.isValid(text) ? { _id: text } : { slug: text };
  return Category.findOne(filter);
}

async function normalizeProductInput(body) {
  const name = String(body.name || '').trim();
  const slug = slugify(body.slug || name);
  const description = String(body.description || '').trim();
  const price = Number.parseFloat(body.price);
  const priceLabel = String(body.priceLabel || '').trim();
  const originalPrice = Number(body.originalPrice);
  const sortOrder = Number(body.sortOrder);
  const images = Array.isArray(body.images)
    ? body.images.map((image) => String(image).trim()).filter(Boolean)
    : String(body.images || '')
      .split(/\r?\n|,/)
      .map((image) => image.trim())
      .filter(Boolean);
  const category = await resolveCategory(body.subcategory || body.subcategoryId || body.subcategorySlug || body.category || body.categoryId || body.categorySlug);

  if (!category) {
    const error = new Error('A valid category is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    slug,
    category: category._id,
    description,
    price: Number.isFinite(price) ? price : 0,
    priceLabel,
    originalPrice: Number.isFinite(originalPrice) ? originalPrice : 0,
    sortOrder: Number.isFinite(sortOrder) && sortOrder > 0 ? sortOrder : 9999,
    images,
    featured: Boolean(body.featured),
    available: body.available === undefined ? true : Boolean(body.available),
  };
}

async function productsCollectionHandler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const filter = {};
      const categoryParam = req.query?.category;

      if (categoryParam) {
        const category = await resolveCategory(categoryParam);

        if (!category) {
          sendJson(res, 200, { products: [] });
          return;
        }

        filter.category = category._id;
      }

      if (req.query?.featured === 'true') {
        filter.featured = true;
      }

      if (req.query?.available === 'true') {
        filter.available = true;
      }

      const products = await Product.find(filter)
        .populate('category')
        .sort({ sortOrder: 1, featured: -1, createdAt: 1 });

      sendJson(res, 200, { products: products.filter((product) => product.category?.active !== false).map(serializeProduct) });
      return;
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const body = readJsonBody(req);
      const input = await normalizeProductInput(body);
      if (body.sortOrder !== undefined && body.sortOrder !== '' && Number(input.sortOrder) < 9999) {
        await Product.updateMany(
          { sortOrder: { $gte: input.sortOrder } },
          { $inc: { sortOrder: 1 } },
        );
      }
      const product = await Product.create(input);
      await product.populate('category');
      sendJson(res, 201, { product: serializeProduct(product) });
      return;
    }

    methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    if (error.statusCode) {
      sendJson(res, error.statusCode, { message: error.message });
      return;
    }

    const response = getErrorResponse(error);
    sendJson(res, response.statusCode, response.body);
  }
}

async function productItemHandler(req, res) {
  try {
    await connectDB();

    const id = getId(req);

    if (!id) {
      sendJson(res, 400, { message: 'Product id or slug is required.' });
      return;
    }

    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    if (req.method === 'GET') {
      const product = await Product.findOne(filter).populate('category');

      if (!product) {
        sendJson(res, 404, { message: 'Product not found.' });
        return;
      }

      if (product.category?.active === false) {
        sendJson(res, 404, { message: 'Product not found.' });
        return;
      }

      sendJson(res, 200, { product: serializeProduct(product) });
      return;
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const body = readJsonBody(req);
      const input = await normalizeProductInput(body);
      const currentProduct = await Product.findOne(filter).select('_id');
      if (!currentProduct) {
        sendJson(res, 404, { message: 'Product not found.' });
        return;
      }
      if (body.sortOrder !== undefined && body.sortOrder !== '' && Number(input.sortOrder) < 9999) {
        await Product.updateMany(
          { _id: { $ne: currentProduct._id }, sortOrder: { $gte: input.sortOrder } },
          { $inc: { sortOrder: 1 } },
        );
      }
      const product = await Product.findOneAndUpdate(filter, input, {
        returnDocument: 'after',
        runValidators: true,
      }).populate('category');

      if (!product) {
        sendJson(res, 404, { message: 'Product not found.' });
        return;
      }

      sendJson(res, 200, { product: serializeProduct(product) });
      return;
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const product = await Product.findOneAndDelete(filter);

      if (!product) {
        sendJson(res, 404, { message: 'Product not found.' });
        return;
      }

      sendJson(res, 200, { ok: true });
      return;
    }

    methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    if (error.statusCode) {
      sendJson(res, error.statusCode, { message: error.message });
      return;
    }

    const response = getErrorResponse(error);
    sendJson(res, response.statusCode, response.body);
  }
}

module.exports = {
  productItemHandler,
  productsCollectionHandler,
};
