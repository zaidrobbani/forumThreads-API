import ThreadRepository from "../ThreadRepository.js";

describe("ThreadRepositoryInterface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.addThread({}, "")).rejects.toThrow(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.getThreadById("")).rejects.toThrow(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.verifyThreadAvailability("")).rejects.toThrow(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.verifyThreadOwner("", "")).rejects.toThrow(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
