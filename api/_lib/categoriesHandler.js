const mongoose = require('mongoose');
const requireAdmin = require('./adminAuth');
const connectDB = require('./db');
const { getErrorResponse, methodNotAllowed, readJsonBody, sendJson } = require('./http');
const { Category, Product } = require('./models');
const { serializeCategory } = require('./serializers');
const slugify = require('./slug');

function getId(req) {
  return req.query?.id || req.params?.id;
}

function normalizeCategoryInput(body) {
  const name = String(body.name || '').trim();
  const slug = slugify(body.slug || name);
  const image = String(body.image || '').trim();
  const description = String(body.description || '').trim();
  const parentId = body.parentId && mongoose.Types.ObjectId.isValid(body.parentId) ? body.parentId : null;

  return {
    name,
    slug,
    image,
    description,
    parentId,
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

async function categoriesCollectionHandler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const filter = req.query?.includeAll === 'true'
        ? {}
        : { active: { $ne: false }, $or: [{ parentId: null }, { parentId: { $exists: false } }] };
      const categories = await Category.find(filter).sort({ createdAt: 1 });
      sendJson(res, 200, { categories: categories.map(serializeCategory) });
      return;
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const input = normalizeCategoryInput(readJsonBody(req));
      const category = await Category.create(input);
      sendJson(res, 201, { category: serializeCategory(category) });
      return;
    }

    methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    const response = getErrorResponse(error);
    sendJson(res, response.statusCode, response.body);
  }
}

async function categoryItemHandler(req, res) {
  try {
    await connectDB();

    const id = getId(req);

    if (!id) {
      sendJson(res, 400, { message: 'Category id or slug is required.' });
      return;
    }

    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    if (req.method === 'GET') {
      const category = await Category.findOne({ ...filter, active: { $ne: false } });

      if (!category) {
        sendJson(res, 404, { message: 'Category not found.' });
        return;
      }

      const children = await Category.find({ parentId: category._id, active: { $ne: false } }).sort({ createdAt: 1 });
      sendJson(res, 200, { category: serializeCategory(category), children: children.map(serializeCategory) });
      return;
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const input = normalizeCategoryInput(readJsonBody(req));
      if (input.parentId && String(input.parentId) === String(id)) {
        sendJson(res, 400, { message: 'A category cannot be its own parent.' });
        return;
      }
      const category = await Category.findOneAndUpdate(filter, input, {
        returnDocument: 'after',
        runValidators: true,
      });

      if (!category) {
        sendJson(res, 404, { message: 'Category not found.' });
        return;
      }

      sendJson(res, 200, { category: serializeCategory(category) });
      return;
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const category = await Category.findOne(filter);

      if (!category) {
        sendJson(res, 404, { message: 'Category not found.' });
        return;
      }

      const productCount = await Product.countDocuments({ category: category._id });
      const childCount = await Category.countDocuments({ parentId: category._id });

      if (childCount > 0) {
        sendJson(res, 409, { message: 'Move or delete subcategories before deleting this category.' });
        return;
      }

      if (productCount > 0) {
        sendJson(res, 409, {
          message: 'Delete or move products in this category before deleting it.',
        });
        return;
      }

      await category.deleteOne();
      sendJson(res, 200, { ok: true });
      return;
    }

    methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    const response = getErrorResponse(error);
    sendJson(res, response.statusCode, response.body);
  }
}

module.exports = {
  categoriesCollectionHandler,
  categoryItemHandler,
};
