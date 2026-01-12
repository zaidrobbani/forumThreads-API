class CommentsRepository {
    async addComment(_newComment) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async verifyCommentOwner(_commentId, _ownerId) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async verifyCommentAvailability(_commentId) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async deleteComment(_commentId) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async getCommentsByThreadId(_threadId) {
        throw new Error("COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }
}

module.exports = CommentsRepository;