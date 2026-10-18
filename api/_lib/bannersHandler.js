const mongoose = require('mongoose');
const requireAdmin = require('./adminAuth');
const connectDB = require('./db');
const { getErrorResponse, methodNotAllowed, readJsonBody, sendJson } = require('./http');
const { Banner } = require('./models');
const { serializeBanner } = require('./serializers');

function getId(req) {
  return req.query?.id || req.params?.id;
}

function normalizeBannerInput(body) {
  const title = String(body.title || '').trim();
  const image = String(body.image || '').trim();
  const link = String(body.link || '').trim();
  const order = Number(body.order);

  if (!image) {
    const error = new Error('Banner image is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    title,
    image,
    link,
    order: Number.isFinite(order) ? order : 1,
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

async function bannersCollectionHandler(req, res) {
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

      const banners = await Banner.find(filter).sort({ order: 1, createdAt: 1 });

      sendJson(res, 200, { banners: banners.map(serializeBanner) });
      return;
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const input = normalizeBannerInput(readJsonBody(req));
      const banner = await Banner.create(input);
      sendJson(res, 201, { banner: serializeBanner(banner) });
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

async function bannerItemHandler(req, res) {
  try {
    await connectDB();

    const id = getId(req);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      sendJson(res, 400, { message: 'Banner id is required.' });
      return;
    }

    const filter = { _id: id };

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const input = normalizeBannerInput(readJsonBody(req));
      const banner = await Banner.findOneAndUpdate(filter, input, {
        returnDocument: 'after',
        runValidators: true,
      });

      if (!banner) {
        sendJson(res, 404, { message: 'Banner not found.' });
        return;
      }

      sendJson(res, 200, { banner: serializeBanner(banner) });
      return;
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) {
        return;
      }

      const banner = await Banner.findOneAndDelete(filter);

      if (!banner) {
        sendJson(res, 404, { message: 'Banner not found.' });
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
  bannerItemHandler,
  bannersCollectionHandler,
};
