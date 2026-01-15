class RepliesRepository {
  async addReply(_newReply) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyOwner(_replyId, _ownerId) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReply(_replyId) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getRepliesByCommentId(_commentId) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyAvailability(_replyId) {
    throw new Error("REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

export default RepliesRepository;
