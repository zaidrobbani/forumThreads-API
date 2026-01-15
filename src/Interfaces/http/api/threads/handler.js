import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";
import AddCommentUseCase from "../../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../../Applications/use_case/DeleteCommentUseCase.js";
import AddReplyUseCase from "../../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../../Applications/use_case/DeleteReplyUseCase.js";
import GetThreadDetailUseCase from "../../../../Applications/use_case/GetThreadDetailUseCase.js";

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute(request.payload, owner);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentUseCase.execute(
      request.payload,
      threadId,
      owner
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, _h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    return {
      status: "success",
    };
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addedReply = await addReplyUseCase.execute(
      request.payload,
      threadId,
      commentId,
      owner
    );

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, _h) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });

    return {
      status: "success",
    };
  }

  async getThreadDetailHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    );
    const { threadId } = request.params;

    const thread = await getThreadDetailUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

export default ThreadsHandler;
