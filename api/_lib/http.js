function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === 'object') {
    return req.body;
  }

  return JSON.parse(req.body);
}

function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  sendJson(res, 405, { message: 'Method not allowed.' });
}

function getErrorResponse(error) {
  if (error?.code === 11000) {
    return {
      statusCode: 409,
      body: { message: 'A record with this slug already exists.' },
    };
  }

  if (error?.name === 'ValidationError') {
    return {
      statusCode: 400,
      body: {
        message: 'Validation failed.',
        errors: Object.values(error.errors).map((item) => item.message),
      },
    };
  }

  if (error?.name === 'CastError') {
    return {
      statusCode: 400,
      body: { message: 'Invalid identifier.' },
    };
  }

  return {
    statusCode: 500,
    body: { message: 'Something went wrong.' },
  };
}

module.exports = {
  getErrorResponse,
  methodNotAllowed,
  readJsonBody,
  sendJson,
};
