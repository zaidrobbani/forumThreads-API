const AuthenticationError = require("../AuthenticationError");

describe("AuthenticationError", () => {
  it("should create AuthenticationError correctly", () => {
    const message = "Authentication failed";
    const authenticationError = new AuthenticationError(message);

    expect(authenticationError.message).toBe(message);
    expect(authenticationError.statusCode).toBe(401);
    expect(authenticationError.name).toBe("AuthenticationError");
  });
});