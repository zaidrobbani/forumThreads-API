import GetThreadDetailUseCase from "../GetThreadDetailUseCase.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentsRepository.js";
import ReplyRepository from "../../../Domains/replies/RepliesRepository.js";

describe("GetThreadDetailUseCase", () => {
  it("should orchestrating the get thread detail action correctly", async () => {
    // Arrange
    const threadId = "thread-123";

    const mockThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const mockComments = [
      {
        id: "comment-123",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_delete: false,
      },
      {
        id: "comment-456",
        username: "dicoding",
        date: "2021-08-08T08:07:01.522Z",
        content: "komentar yang dihapus",
        is_delete: true,
      },
    ];

    const mockRepliesForComment123 = [
      {
        id: "reply-123",
        content: "sebuah balasan",
        date: "2021-08-08T07:59:48.766Z",
        username: "dicoding",
        is_delete: false,
      },
    ];

    const mockRepliesForComment456 = [];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === "comment-123") {
          return Promise.resolve(mockRepliesForComment123);
        }
        return Promise.resolve(mockRepliesForComment456);
      });

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      threadId
    );
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      threadId
    );
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith(
      "comment-123"
    );
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith(
      "comment-456"
    );

    expect(detailThread.comments).toHaveLength(2);
    expect(detailThread.comments[0].content).toEqual("sebuah comment");
    expect(detailThread.comments[1].content).toEqual(
      "**komentar telah dihapus**"
    );
    expect(detailThread.comments[0].replies).toHaveLength(1);
    expect(detailThread.comments[0].replies[0].content).toEqual(
      "sebuah balasan"
    );
  });

  it("should handle soft deleted replies correctly", async () => {
    // Arrange
    const threadId = "thread-123";

    const mockThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const mockComments = [
      {
        id: "comment-123",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_delete: false,
      },
    ];

    const mockReplies = [
      {
        id: "reply-123",
        content: "balasan yang dihapus",
        date: "2021-08-08T07:59:48.766Z",
        username: "dicoding",
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(detailThread.comments[0].replies[0].content).toEqual(
      "**balasan telah dihapus**"
    );
  });
});
