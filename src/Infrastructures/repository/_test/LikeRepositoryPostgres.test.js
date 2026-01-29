import LikesTableTestHelper from "../../../../tests/LikeTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UserTableTestHelper.js";
import LikeRepositoryPostgres from "../LikeRepositoryPostgres.js";
import pool from "../../database/postgres/pool.js";

describe("LikeRepositoryPostgres", () => {
  beforeEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("isCommentLikedByUser function", () => {
    it("should return true when user already liked the comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        commentId: "comment-123",
        userId: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const isLiked = await likeRepositoryPostgres.isCommentLikedByUser(
        "comment-123",
        "user-123",
      );

      // Assert
      expect(isLiked).toBe(true);
    });

    it("should return false when user has not liked the comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const isLiked = await likeRepositoryPostgres.isCommentLikedByUser(
        "comment-123",
        "user-123",
      );

      // Assert
      expect(isLiked).toBe(false);
    });
  });

  describe("addLike function", () => {
    it("should persist like correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.addLike("comment-123", "user-123");

      // Assert
      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(1);
      expect(likes[0].comment_id).toEqual("comment-123");
      expect(likes[0].user_id).toEqual("user-123");
    });
  });

  describe("deleteLike function", () => {
    it("should delete like correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        commentId: "comment-123",
        userId: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.deleteLike("comment-123", "user-123");

      // Assert
      const likes = await LikesTableTestHelper.findLikeByCommentAndUser(
        "comment-123",
        "user-123",
      );
      expect(likes).toHaveLength(0);
    });
  });

  describe("getLikeCountByCommentId function", () => {
    it("should return correct like count", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await UsersTableTestHelper.addUser({ id: "user-456", username: "john" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        commentId: "comment-123",
        userId: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-456",
        commentId: "comment-123",
        userId: "user-456",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const count =
        await likeRepositoryPostgres.getLikeCountByCommentId("comment-123");

      // Assert
      expect(count).toEqual(2);
    });

    it("should return 0 when no likes", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const count =
        await likeRepositoryPostgres.getLikeCountByCommentId("comment-123");

      // Assert
      expect(count).toEqual(0);
    });
  });
});
