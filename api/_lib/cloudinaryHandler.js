const crypto = require('node:crypto');
const requireAdmin = require('./adminAuth');
const { methodNotAllowed, readJsonBody, sendJson } = require('./http');

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
}

function signParams(params, apiSecret) {
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHash('sha1').update(`${signatureBase}${apiSecret}`).digest('hex');
}

async function uploadDataUrl(dataUrl, config) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    folder: 'mini-uphaarrr',
    timestamp,
  };
  const formData = new FormData();

  formData.set('file', dataUrl);
  formData.set('api_key', config.apiKey);
  formData.set('timestamp', String(timestamp));
  formData.set('folder', params.folder);
  formData.set('signature', signParams(params, config.apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error?.message || 'Cloudinary upload failed.');
  }

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
}

async function uploadImagesHandler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST']);
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  const config = getCloudinaryConfig();

  if (!config) {
    sendJson(res, 503, {
      message: 'Image upload is not configured. Set Cloudinary environment variables on the server.',
    });
    return;
  }

  try {
    const body = readJsonBody(req);
    const images = Array.isArray(body.images) ? body.images : [];

    if (images.length === 0) {
      sendJson(res, 400, { message: 'Choose at least one image to upload.' });
      return;
    }

    if (images.length > 10) {
      sendJson(res, 400, { message: 'Upload up to 10 images at a time.' });
      return;
    }

    const uploads = await Promise.all(images.map((image) => {
      const dataUrl = typeof image === 'string' ? image : image?.dataUrl;

      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        throw new Error('Only image files can be uploaded.');
      }

      return uploadDataUrl(dataUrl, config);
    }));

    sendJson(res, 200, {
      images: uploads.map((upload) => upload.secureUrl),
      uploads,
    });
  } catch (error) {
    sendJson(res, 500, {
      message: error.message || 'Image upload failed.',
    });
  }
}

module.exports = uploadImagesHandler;
