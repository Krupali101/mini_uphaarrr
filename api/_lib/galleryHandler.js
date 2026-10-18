const mongoose = require('mongoose');
const requireAdmin = require('./adminAuth');
const connectDB = require('./db');
const { getErrorResponse, methodNotAllowed, readJsonBody, sendJson } = require('./http');
const { GalleryItem } = require('./models');
const { serializeGalleryItem } = require('./serializers');

function getId(req) {
  return req.query?.id || req.params?.id;
}

function normalizeGalleryInput(body) {
  const image = String(body.image || '').trim();
  const title = String(body.title || '').trim();
  const order = Number(body.order);

  if (!image) {
    const error = new Error('Gallery image is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    image,
    title,
    order: Number.isFinite(order) ? order : 1,
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

async function galleryCollectionHandler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      let filter = { active: true };

      if (req.query?.includeInactive === 'true') {
        if (!requireAdmin(req, res)) {
          return;
        }

        filter = {};
      }

      const galleryItems = await GalleryItem.find(filter).sort({ order: 1, createdAt: 1 });

      sendJson(res, 200, { galleryItems: galleryItems.map(serializeGalleryItem) });
      return;
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const input = normalizeGalleryInput(readJsonBody(req));
      const galleryItem = await GalleryItem.create(input);
      sendJson(res, 201, { galleryItem: serializeGalleryItem(galleryItem) });
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

async function galleryItemHandler(req, res) {
  try {
    await connectDB();

    const id = getId(req);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      sendJson(res, 400, { message: 'Gallery item id is required.' });
      return;
    }

    const filter = { _id: id };

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const input = normalizeGalleryInput(readJsonBody(req));
      const galleryItem = await GalleryItem.findOneAndUpdate(filter, input, {
        returnDocument: 'after',
        runValidators: true,
      });

      if (!galleryItem) {
        sendJson(res, 404, { message: 'Gallery item not found.' });
        return;
      }

      sendJson(res, 200, { galleryItem: serializeGalleryItem(galleryItem) });
      return;
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const galleryItem = await GalleryItem.findOneAndDelete(filter);

      if (!galleryItem) {
        sendJson(res, 404, { message: 'Gallery item not found.' });
        return;
      }

      sendJson(res, 200, { ok: true });
      return;
    }

    methodNotAllowed(res, ['PUT', 'DELETE']);
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
  galleryCollectionHandler,
  galleryItemHandler,
};
