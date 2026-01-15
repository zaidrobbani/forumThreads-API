import Jwt from "@hapi/jwt";
import InvariantError from "../../../Commons/exceptions/InvariantError.js";
import JwtTokenManager from "../JwtTokenManager.js";

describe("JwtTokenManager", () => {
  describe("createAccessToken function", () => {
    it("should create accessToken correctly", async () => {
      // Arrange
      const payload = {
        username: "dicoding",
      };
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe("string");
    });
  });

  describe("createRefreshToken function", () => {
    it("should create refreshToken correctly", async () => {
      // Arrange
      const payload = {
        username: "dicoding",
      };
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe("string");
    });
  });

  describe("verifyRefreshToken function", () => {
    it("should throw InvariantError when verification failed", async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: "dicoding",
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken)
      ).rejects.toThrow(InvariantError);
    });

    it("should not throw InvariantError when refresh token verified", async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: "dicoding",
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken)
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe("decodePayload function", () => {
    it("should decode payload correctly", async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: "dicoding",
        id: "user-123",
      });

      // Action
      const { username, id } = await jwtTokenManager.decodePayload(accessToken);

      // Assert
      expect(username).toEqual("dicoding");
      expect(id).toEqual("user-123");
    });
  });
});
