const createApiServer = require('./dev-api-once');

const server = createApiServer();

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log('API already running on http://localhost:3001; using the existing server.');
    setInterval(() => {}, 1000);
    return;
  }

  throw error;
});

server.listen(3001, () => {
  console.log('API running on http://localhost:3001');
});
