const { sendJson } = require('./http');

function requireAdmin(req, res) {
  const configuredToken = process.env.ADMIN_API_TOKEN;

  if (!configuredToken) {
    sendJson(res, 503, {
      message: 'Admin API is not configured. Set ADMIN_API_TOKEN on the server.',
    });
    return false;
  }

  const providedToken = req.headers['x-admin-token'];

  if (!providedToken || providedToken !== configuredToken) {
    sendJson(res, 401, { message: 'Admin authorization is required.' });
    return false;
  }

  return true;
}

module.exports = requireAdmin;
