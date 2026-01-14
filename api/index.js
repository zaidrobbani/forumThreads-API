const createServer = require("../src/Infrastructures/http/createServer");
const container = require("../src/Infrastructures/container");

let server;

// Helper untuk parse body dari stream
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve(body);
      }
    });
    req.on("error", reject);
  });
};

const handler = async (req, res) => {
  try {

    // Initialize server hanya sekali
    if (!server) {
      server = await createServer(container);
      await server.initialize();
    }

    // Parse body untuk POST/PUT/PATCH requests
    let payload = req.body;
    if (!payload && ["POST", "PUT", "PATCH"].includes(req.method)) {
      payload = await parseBody(req);
    }

    // Hapi.js inject method untuk serverless
    const response = await server.inject({
      method: req.method,
      url: req.url,
      headers: req.headers,
      payload: payload,
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

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: error.message || "Internal server error",
        stack: error.stack,
      })
    );
  }
};

module.exports = handler;
