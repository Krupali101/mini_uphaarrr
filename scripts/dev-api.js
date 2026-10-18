const createApiServer = require('./dev-api-once');

const server = createApiServer();

server.listen(3001, () => {
  console.log('API running on http://localhost:3001');
});
