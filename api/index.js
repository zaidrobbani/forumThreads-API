const createServer = require("../src/Infrastructures/http/createServer");
const container = require("../src/Infrastructures/container");

let server;

const handler = async (req, res) => {
  if (!server) {
    server = await createServer(container);
    await server.initialize();
  }

  // Hapi.js inject method untuk serverless
  const response = await server.inject({
    method: req.method,
    url: req.url,
    headers: req.headers,
    payload: req.body,
    remoteAddress: req.connection?.remoteAddress,
  });

  // Set headers dari response Hapi
  res.statusCode = response.statusCode;
  Object.keys(response.headers).forEach((key) => {
    res.setHeader(key, response.headers[key]);
  });

  // Send response
  res.end(response.result);
};

module.exports = handler;
