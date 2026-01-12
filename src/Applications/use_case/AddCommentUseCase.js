const NewComment = require("../../Domains/comments/entities/NewComments");

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, threadId, owner) {
        const newComment = new NewComment(useCasePayload);

        await this._threadRepository.verifyThreadAvailability(threadId);

        return this._commentRepository.addComment(newComment, threadId, owner);
    }
}

module.exports = AddCommentUseCase;