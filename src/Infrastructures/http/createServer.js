import Hapi from "@hapi/hapi";
import ClientError from "../../Commons/exceptions/ClientError.js";
import DomainErrorTranslator from "../../Commons/exceptions/DomainErrorTranslator.js";
import users from "../../Interfaces/http/api/users/index.js";
import authentications from "../../Interfaces/http/api/authentications/index.js";
import threads from "../../Interfaces/http/api/threads/index.js";
import Jwt from "@hapi/jwt";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";

const createServer = async (container) => {
  const serverConfig = {
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  };

  // Hanya set host dan port jika bukan production (untuk local dev)
  if (process.env.NODE_ENV !== "production") {
    serverConfig.host = process.env.APP_HOST || "localhost";
    serverConfig.port = process.env.PORT || 5000;
  }

  const server = Hapi.server(serverConfig);

  // Swagger configuration
  const swaggerOptions = {
    info: {
      title: "Forum API Documentation",
      version: "1.0.0",
      description: "API Documentation for Forum Application",
    },
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [{ jwt: [] }],
  };

  // Register Swagger plugins
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  // Register JWT plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Define authentication strategy
  server.auth.strategy("forumapi_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Register route plugins
  await server.register([
    {
      plugin: users,
      options: {
        container,
      },
    },
    {
      plugin: authentications,
      options: {
        container,
      },
    },
    {
      plugin: threads,
      options: {
        container,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // Log error untuk debugging

      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // Handle Hapi Boom errors (validation errors, dll)
      if (response.isBoom) {
        const { statusCode } = response.output;

        // Jika error 400 (Bad Request) dari payload validation
        if (statusCode === 400) {
          const newResponse = h.response({
            status: "fail",
            message: "Pesan apapun selama tidak kosong",
          });
          newResponse.code(statusCode);
          return newResponse;
        }
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

export default createServer;
