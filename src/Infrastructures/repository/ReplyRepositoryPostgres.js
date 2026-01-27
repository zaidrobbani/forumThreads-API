import ReplyRepository from "../../Domains/replies/RepliesRepository.js";
import AddedReply from "../../Domains/replies/entities/AddedReply.js";
import NotFoundError from "../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../Commons/exceptions/AuthorizationError.js";

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO replies (id, comment_id, content,  owner, date, is_delete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, commentId, content, owner, date, false],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyAvailability(replyId) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Pesan apapun selama tidak kosong.");
    }
  }

  async verifyReplyOwner(replyId, ownerId) {
    const query = {
      text: "SELECT id, owner FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Pesan apapun selama tidak kosong.");
    }

    const reply = result.rows[0];

    if (reply.owner !== ownerId) {
      throw new AuthorizationError("Pesan apapun selama tidak kosong.");
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: "UPDATE replies SET is_delete = true WHERE id = $1",
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete
            FROM replies
            LEFT JOIN users ON replies.owner = users.id
            WHERE replies.comment_id = $1
            ORDER BY replies.date ASC`,
      values: [commentId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }
}

export default ReplyRepositoryPostgres;
