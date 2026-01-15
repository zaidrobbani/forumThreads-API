import NotFoundError from "../NotFoundError.js";

describe("NotFoundError", () => {
  it("should create NotFoundError correctly", () => {
    // Arrange
    const message = "Not Found";

    // Action
    const notFoundError = new NotFoundError(message);

    // Assert
    expect(notFoundError.message).toEqual(message);
    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.name).toEqual("NotFoundError");
  });
});
