import PasswordHash from "../PasswordHash.js";

describe("PasswordHash", () => {
  it("should hash password correctly", async () => {
    // Arrange
    const password = new PasswordHash();

    // Action & Assert
    await expect(password.hash("Secret_password")).rejects.toThrow(
      "PASSWORD_HASH.METHOD_NOT_IMPLEMENTED"
    );
  });
});
