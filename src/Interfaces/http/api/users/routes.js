
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
    },
  },
];

export default routes;
