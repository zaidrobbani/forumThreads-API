import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async isCommentLikedByUser(commentId, userId) {
        const query = {
            text: 'SELECT id FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
            values: [commentId, userId],
        }

        const result = await this._pool.query(query);
        return result.rowCount > 0;
    }

    async addLike(commentId, userId) {
        const id = `like-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO user_comment_likes (id, comment_id, user_id, date) VALUES ($1, $2, $3, $4)',
            values: [id, commentId, userId, date],
        }

        await this._pool.query(query);
    }

    async deleteLike(commentId, userId) {
        const query = {
            text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
            values: [commentId, userId],
        }

        await this._pool.query(query);
    }

    async getLikeCountByCommentId(commentId) {
        const query = {
            text: 'SELECT COUNT(*)::int AS count FROM user_comment_likes WHERE comment_id = $1',
            values: [commentId],
        }

        const result = await this._pool.query(query);
        return parseInt(result.rows[0].count, 10);
    }
}

export default LikeRepositoryPostgres;