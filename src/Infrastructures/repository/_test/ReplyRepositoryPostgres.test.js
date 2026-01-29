import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UserTableTestHelper.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";
import NewReply from "../../../Domains/replies/entities/NewReply.js";
import AddedReply from "../../../Domains/replies/entities/AddedReply.js";
import ReplyRepositoryPostgres from "../ReplyRepositoryPostgres.js";
import pool from "../../database/postgres/pool.js";

describe("ReplyRepositoryPostgres", () => {
  beforeEach(async () => {
    // Cukup truncate users, sisanya otomatis ke-cascade
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist new reply and return added reply correctly", async () => {
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
      const newReply = new NewReply({
        content: "sebuah balasan",
      });
      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await replyRepositoryPostgres.addReply(
        newReply,
        "comment-123",
        "user-123",
      );

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
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
      const newReply = new NewReply({
        content: "sebuah balasan",
      });
      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(
        newReply,
        "comment-123",
        "user-123",
      );

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "sebuah balasan",
          owner: "user-123",
        }),
      );
    });
  });

  describe("verifyReplyAvailability function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyAvailability("reply-123"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when reply found", async () => {
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
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyAvailability("reply-123"),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-123"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw AuthorizationError when user is not the owner", async () => {
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
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-456"),
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw error when user is the owner", async () => {
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
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-123"),
      ).resolves.not.toThrow();
    });
  });

  describe("deleteReply function", () => {
    it("should soft delete reply correctly", async () => {
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
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply("reply-123");

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe("getRepliesByCommentId function", () => {
    it("should return replies correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        content: "sebuah balasan",
        owner: "user-123",
        isDelete: false,
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-456",
        commentId: "comment-123",
        content: "balasan yang dihapus",
        owner: "user-123",
        isDelete: true,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies =
        await replyRepositoryPostgres.getRepliesByCommentId("comment-123");

      // Assert
      expect(replies).toHaveLength(2);

      // Find replies by ID (order not guaranteed when dates are the same)
      const reply123 = replies.find((r) => r.id === "reply-123");
      const reply456 = replies.find((r) => r.id === "reply-456");

      expect(reply123).toBeDefined();
      expect(reply123.id).toEqual("reply-123");
      expect(reply123.username).toEqual("dicoding");
      expect(reply123.content).toEqual("sebuah balasan");
      expect(reply123.is_delete).toEqual(false);

      expect(reply456).toBeDefined();
      expect(reply456.id).toEqual("reply-456");
      expect(reply456.is_delete).toEqual(true);
    });

    it("should return empty array when no replies", async () => {
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
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies =
        await replyRepositoryPostgres.getRepliesByCommentId("comment-123");

      // Assert
      expect(replies).toHaveLength(0);
    });
  });
});
