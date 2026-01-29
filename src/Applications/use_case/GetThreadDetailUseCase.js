import DetailThread from "../../Domains/threads/entities/Detailthread.js";

class GetThreadDetailUsecase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadAvailability(threadId);

    const threadDetail = await this._threadRepository.getThreadById(threadId);

    const comment =
      await this._commentRepository.getCommentsByThreadId(threadId);

    const commentWithReplies = await Promise.all(
      comment.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(
          comment.id,
        );
        const likeCount = await this._likeRepository.getLikeCountByCommentId(
          comment.id,
        );

        return {
          id: comment.id,
          username: comment.username,
          date: new Date(comment.date).toISOString(),
          content: comment.is_delete
            ? "**komentar telah dihapus**"
            : comment.content,
          likeCount,
          replies: replies.map((reply) => ({
            id: reply.id,
            content: reply.is_delete
              ? "**balasan telah dihapus**"
              : reply.content,
            date: new Date(reply.date).toISOString(),
            username: reply.username,
          })),
        };
      }),
    );

    return new DetailThread({
      id: threadDetail.id,
      title: threadDetail.title,
      body: threadDetail.body,
      date: new Date(threadDetail.date).toISOString(),
      username: threadDetail.username,
      comments: commentWithReplies,
    });
  }
}

export default GetThreadDetailUsecase;
