import ToggleLikeUseCase from '../ToggleLikeUseCase.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import CommentRepository from '../../../Domains/comments/CommentsRepository.js';

describe('ToggleLikeUseCase', () => {
  it('should orchestrate the toggle like action correctly when the comment is not liked by the user', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.isCommentLikedByUser = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeUseCase = new ToggleLikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.isCommentLikedByUser)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockLikeRepository.addLike)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });
});