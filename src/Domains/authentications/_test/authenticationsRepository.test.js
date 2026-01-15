import AuthenticationRepository from "../authenticationsRepository.js";

describe("AuthenticationRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository();

    // Action & Assert
    await expect(authenticationRepository.addToken("")).rejects.toThrow(
      "AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      authenticationRepository.checkAvailabilityToken("")
    ).rejects.toThrow("AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(authenticationRepository.deleteToken("")).rejects.toThrow(
      "AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
