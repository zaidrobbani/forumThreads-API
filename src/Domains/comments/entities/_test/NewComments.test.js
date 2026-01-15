import NewComments from "../NewComments.js";

describe("NewComments Entities", () => {
  it("should throw when payload not contain needed property", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
    };

    // Action and Assert
    expect(() => new NewComments(payload)).toThrow(
      "NEW_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new NewComments(payload)).toThrow(
      "NEW_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewComments object correctly", () => {
    // Arrange
    const payload = {
      content: "sebuah comment",
    };

    // Action
    const { content } = new NewComments(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
