class ToggleLikeUseCase {
    constructor({ likeRepository, commentRepository }) {
        this._likeRepository = likeRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { commentId, userId } = useCasePayload;

        await this._commentRepository.verifyCommentAvailability(commentId);

        const isLiked = await this._likeRepository.isCommentLikedByUser(commentId, userId);

        if (isLiked) {
            await this._likeRepository.deleteLike(commentId, userId);
        } else {
            await this._likeRepository.addLike(commentId, userId);
        }
    }
}

export default ToggleLikeUseCase;