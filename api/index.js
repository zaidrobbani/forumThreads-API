const createServer = require("../src/Infrastructures/http/createServer");
const container = require("../src/Infrastructures/container");

let server;

const handler = async (req, res) => {
  try {
    // Initialize server hanya sekali
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

    // Send response - handle berbagai tipe response
    if (typeof response.result === "object") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.result));
    } else {
      res.end(response.result);
    }
  } catch (error) {
    console.error("Error in serverless function:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: error.message || "Internal server error",
      })
    );
  }
};

module.exports = handler;
