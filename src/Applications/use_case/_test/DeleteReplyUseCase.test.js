import DeleteReplyUseCase from "../DeleteReplyUseCase.js";
import ReplyRepository from "../../../Domains/replies/RepliesRepository.js";
import CommentRepository from "../../../Domains/comments/CommentsRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
      owner: "user-123",
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(
      mockCommentRepository.verifyCommentAvailability
    ).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.verifyReplyAvailability).toHaveBeenCalledWith(
      useCasePayload.replyId
    );
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner
    );
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
      useCasePayload.replyId
    );
  });
});
