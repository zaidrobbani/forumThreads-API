import Joi from "joi";

const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
    options: {
      auth: false,
      tags: ["api", "users"],
      description: "Register new user",
      notes: "Create a new user account",
      validate: {
        payload: Joi.object({
          username: Joi.string()
            .required()
            .description("Username for the new user"),
          password: Joi.string()
            .required()
            .description("Password for the new user"),
          fullname: Joi.string()
            .required()
            .description("Full name of the user"),
        }),
      },
    },
  },
];

export default routes;
