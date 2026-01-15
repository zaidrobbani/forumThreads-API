import UserRepository from "../UserRepository.js";

describe("UserRepositoryInterface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action & Assert
    await expect(userRepository.addUser({})).rejects.toThrow(
      "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(userRepository.verifyAvailableUsername("")).rejects.toThrow(
      "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(userRepository.getPasswordByUsername("")).rejects.toThrow(
      "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
