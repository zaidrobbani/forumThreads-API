import UsersTableTestHelper from "../../../../tests/UserTableTestHelper.js";
import InvariantError from "../../../Commons/exceptions/InvariantError.js";
import RegisterUser from "../../../Domains/users/entities/RegisterUser.js";
import RegisteredUser from "../../../Domains/users/entities/RegisteredUser.js";
import pool from "../../database/postgres/pool.js";
import UserRepositoryPostgres from "../UserRepositoryPostgres.js";

describe("UserRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyAvailableUsername function", () => {
    it("should throw InvariantError when username not available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: "dicoding" }); // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).rejects.toThrow(InvariantError);
    });

    it("should not throw InvariantError when username available", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe("addUser function", () => {
    it("should persist register user", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "dicoding Indonesia",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById("user-123");
      expect(users).toHaveLength(1);
    });

    it("should return registered user correctly", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "dicoding",
        password: "secret_password",
        fullname: "dicoding Indonesia",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: "user-123",
          username: "dicoding",
          fullname: "dicoding Indonesia",
        })
      );
    });
  });

  describe("getPasswordByUsername function", () => {
    it("should return password when username is valid", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret",
      });

      // Action
      const password = await userRepositoryPostgres.getPasswordByUsername(
        "dicoding"
      );

      // Assert
      expect(password).toEqual("secret");
    });

    it("should throw InvariantError when username is invalid", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.getPasswordByUsername("invalid_username")
      ).rejects.toThrow(InvariantError);
    });
  });

  describe("getIdByUsername function", () => {
    it("should return id when username is valid", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });

      // Action
      const id = await userRepositoryPostgres.getIdByUsername("dicoding");

      // Assert
      expect(id).toEqual("user-123");
    });

    it("should throw InvariantError when username is invalid", async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.getIdByUsername("invalid_username")
      ).rejects.toThrow(InvariantError);
    });
  });
});
