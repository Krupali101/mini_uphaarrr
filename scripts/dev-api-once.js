const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

loadEnvFile(path.resolve(__dirname, '..', '.env'));
loadEnvFile(path.resolve(__dirname, '..', '.env.local'));

const { categoriesCollectionHandler, categoryItemHandler } = require('../api/_lib/categoriesHandler');
const { productItemHandler, productsCollectionHandler } = require('../api/_lib/productsHandler');
const { bannerItemHandler, bannersCollectionHandler } = require('../api/_lib/bannersHandler');
const { galleryCollectionHandler, galleryItemHandler } = require('../api/_lib/galleryHandler');
const { announcementsCollectionHandler, announcementItemHandler } = require('../api/_lib/announcementsHandler');
const { collection: testimonialsCollectionHandler, item: testimonialItemHandler } = require('../api/_lib/testimonialsHandler');
const uploadImagesHandler = require('../api/upload-images');
const sendEmail = require('../api/send-email');

const readBody = (req) => new Promise((resolve, reject) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => resolve(body));
  req.on('error', reject);
});

const routes = [
  { pattern: /^\/api\/send-email\/?$/, handler: sendEmail },
  { pattern: /^\/api\/categories\/?$/, handler: categoriesCollectionHandler },
  { pattern: /^\/api\/categories\/([^/]+)\/?$/, handler: categoryItemHandler, paramName: 'id' },
  { pattern: /^\/api\/products\/?$/, handler: productsCollectionHandler },
  { pattern: /^\/api\/products\/([^/]+)\/?$/, handler: productItemHandler, paramName: 'id' },
  { pattern: /^\/api\/banners\/?$/, handler: bannersCollectionHandler },
  { pattern: /^\/api\/banners\/([^/]+)\/?$/, handler: bannerItemHandler, paramName: 'id' },
  { pattern: /^\/api\/gallery\/?$/, handler: galleryCollectionHandler },
  { pattern: /^\/api\/gallery\/([^/]+)\/?$/, handler: galleryItemHandler, paramName: 'id' },
  { pattern: /^\/api\/announcement\/?$/, handler: announcementsCollectionHandler },
  { pattern: /^\/api\/announcement\/([^/]+)\/?$/, handler: announcementItemHandler, paramName: 'id' },
  { pattern: /^\/api\/testimonials\/?$/, handler: testimonialsCollectionHandler },
  { pattern: /^\/api\/testimonials\/([^/]+)\/?$/, handler: testimonialItemHandler, paramName: 'id' },
  { pattern: /^\/api\/upload-images\/?$/, handler: uploadImagesHandler },
];

function createApiServer() {
  return http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, 'http://localhost');
    const route = routes
      .map((item) => ({ ...item, match: requestUrl.pathname.match(item.pattern) }))
      .find((item) => item.match);

    if (!route) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Not found.' }));
      return;
    }

    req.body = await readBody(req);
    req.query = Object.fromEntries(requestUrl.searchParams.entries());
    req.params = route.paramName ? { [route.paramName]: decodeURIComponent(route.match[1]) } : {};
    route.handler(req, res);
  });
}

module.exports = createApiServer;

if (require.main === module) {
  const port = Number(process.env.PORT || 3001);
  createApiServer().listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}
