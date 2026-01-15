import AddedReply from "../AddedReply.js";

describe("AddedReply Entities", () => {
  it("should throw when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "sebuah reply",
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrow(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "sebuah reply",
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrow(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedReply object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "sebuah reply",
      owner: "user-123",
    };

    // Action
    const { id, content, owner } = new AddedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
