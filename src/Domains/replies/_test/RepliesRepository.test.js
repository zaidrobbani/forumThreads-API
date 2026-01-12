const RepliesRepository = require("../RepliesRepository");

describe("RepliesRepositoryInterface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const repliesRepository = new RepliesRepository();

    // Action & Assert
    await expect(repliesRepository.addReply({})).rejects.toThrow(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repliesRepository.verifyReplyOwner("", "")).rejects.toThrow(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repliesRepository.verifyReplyAvailability("")).rejects.toThrow(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repliesRepository.deleteReply("")).rejects.toThrow(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repliesRepository.getRepliesByCommentId([])).rejects.toThrow(
      "REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
