import NewReply from "../NewReply.js";

describe("NewReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 12345,
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newReply object correctly", () => {
    // Arrange
    const payload = {
      content: "sebuah reply",
    };

    // Action
    const { content } = new NewReply(payload);
    // Assert
    expect(content).toEqual(payload.content);
  });
});
