import Joi from "joi";

const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forumapi_jwt",
      tags: ["api", "threads"],
      description: "Create new thread",
      notes: "Create a new thread (requires authentication)",
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: "forumapi_jwt",
      tags: ["api", "comments"],
      description: "Add comment to thread",
      notes: "Add a comment to a specific thread (requires authentication)",
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description("Thread ID"),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "forumapi_jwt",
      tags: ["api", "comments"],
      description: "Delete comment",
      notes:
        "Delete a specific comment (requires authentication and ownership)",
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description("Thread ID"),
          commentId: Joi.string().required().description("Comment ID"),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyHandler,
    options: {
      auth: "forumapi_jwt",
      tags: ["api", "replies"],
      description: "Add reply to comment",
      notes: "Add a reply to a specific comment (requires authentication)",
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description("Thread ID"),
          commentId: Joi.string().required().description("Comment ID"),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyHandler,
    options: {
      auth: "forumapi_jwt",
      tags: ["api", "replies"],
      description: "Delete reply",
      notes: "Delete a specific reply (requires authentication and ownership)",
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description("Thread ID"),
          commentId: Joi.string().required().description("Comment ID"),
          replyId: Joi.string().required().description("Reply ID"),
        }),
      },
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadDetailHandler,
    options: {
      auth: false,
      tags: ["api", "threads"],
      description: "Get thread detail",
      notes:
        "Get detailed information about a specific thread including comments and replies",
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description("Thread ID"),
        }),
      },
    },
  },
  {
    method: "PUT",
    path: "/threads/{threadId}/comments/{commentId}/likes",
    handler: handler.putLikeHandler,
    options: {
      auth: "forumapi_jwt",
      tags: ["api", "likes"],
      description: "Toggle like on comment",
      notes:
        "Like or unlike a comment (requires authentication). If user has not liked, it will add a like. If user already liked, it will remove the like.",
      validate: {
        params: Joi.object({
          threadId: Joi.string().required().description("Thread ID"),
          commentId: Joi.string().required().description("Comment ID"),
        }),
      },
    },
  },
];

export default routes;
