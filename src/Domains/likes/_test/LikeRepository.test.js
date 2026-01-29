import LikeRepository from "../LikeRepository";

describe("LikeRepositoryInterface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(
      likeRepository.isCommentLikedByUser("", ""),
    ).rejects.toThrow("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      likeRepository.addLike("", ""),
    ).rejects.toThrow("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      likeRepository.deleteLike("", ""),
    ).rejects.toThrow("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      likeRepository.getLikeCountByCommentId(""),
    ).rejects.toThrow("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});