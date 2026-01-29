class LikeRepository {
    async isCommentLikedByUser(_commentId, _userId) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async addLike(_commentId, _userId) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async deleteLike(_commentId, _userId) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async getLikeCountByCommentId(_commentId) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }
}

export default LikeRepository;