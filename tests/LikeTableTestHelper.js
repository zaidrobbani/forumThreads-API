/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool.js";

const LikesTableTestHelper = {
  async addLike({
    id = "like-123",
    commentId = "comment-123",
    userId = "user-123",
  }) {
    const createdAt = new Date().toISOString();
    const query = {
      text: "INSERT INTO user_comment_likes (id, comment_id, user_id, date) VALUES($1, $2, $3, $4)",
      values: [id, commentId, userId, createdAt],
    };

    await pool.query(query);
  },

  async findLikeById(id) {
    const query = {
      text: "SELECT * FROM user_comment_likes WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findLikeByCommentAndUser(commentId, userId) {
    const query = {
      text: "SELECT * FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getLikeCount(commentId) {
    const query = {
      text: "SELECT COUNT(*)::int as count FROM user_comment_likes WHERE comment_id = $1",
      values: [commentId],
    };

    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE user_comment_likes CASCADE");
  },
};

export default LikesTableTestHelper;
