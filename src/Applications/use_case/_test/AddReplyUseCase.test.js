import AddReplyUseCase from "../AddReplyUseCase.js";
import ReplyRepository from "../../../Domains/replies/RepliesRepository.js";
import CommentRepository from "../../../Domains/comments/CommentsRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import NewReply from "../../../Domains/replies/entities/NewReply.js";
import AddedReply from "../../../Domains/replies/entities/AddedReply.js";

describe("AddReplyUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "sebuah balasan",
    };
    const threadId = "thread-123";
    const commentId = "comment-123";
    const owner = "user-123";

    const mockAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(
      useCasePayload,
      threadId,
      commentId,
      owner
    );

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: "reply-123",
        content: useCasePayload.content,
        owner,
      })
    );
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      threadId
    );
    expect(
      mockCommentRepository.verifyCommentAvailability
    ).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      new NewReply(useCasePayload),
      commentId,
      owner
    );
  });
});
