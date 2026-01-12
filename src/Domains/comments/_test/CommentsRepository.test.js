const CommentsRepository = require("../CommentsRepository");

describe("CommentsRepositoryInterface", () => {
    it("should throw error when invoke abstract behavior", async () => {
        // Arrange
        const commentsRepository = new CommentsRepository();

        // Action & Assert
        await expect(commentsRepository.addComment({})).rejects.toThrow(
            "COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
        await expect(
            commentsRepository.verifyCommentOwner("", "")
        ).rejects.toThrow("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(
            commentsRepository.verifyCommentAvailability("")
        ).rejects.toThrow("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
        await expect(commentsRepository.deleteComment("")).rejects.toThrow(
            "COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
        );
        await expect(
            commentsRepository.getCommentsByThreadId("")
        ).rejects.toThrow("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
});

