import Joi from "joi";

const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthenticationHandler,
    options: {
      auth: false,
      tags: ["api", "authentications"],
      description: "User login",
      notes: "Authenticate user and get access token",
      validate: {
        payload: Joi.object({
          username: Joi.string().required().description("Username"),
          password: Joi.string().required().description("Password"),
        }),
      },
    },
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler.putAuthenticationHandler,
    options: {
      auth: false,
      tags: ["api", "authentications"],
      description: "Refresh access token",
      notes: "Get new access token using refresh token",
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required().description("Refresh token"),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: handler.deleteAuthenticationHandler,
    options: {
      auth: false,
      tags: ["api", "authentications"],
      description: "User logout",
      notes: "Logout user and invalidate refresh token",
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string()
            .required()
            .description("Refresh token to be deleted"),
        }),
      },
    },
  },
];

export default routes;
