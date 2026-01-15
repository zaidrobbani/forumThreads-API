import AddedComments from "../AddedComments.js";

describe("AddedComments Entities", () => {
  it("should throw when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "sebuah comment",
    };

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrow(
      "ADDED_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "sebuah comment",
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrow(
      "ADDED_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedComments object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "sebuah comment",
      owner: "user-123",
    };

    // Action
    const { id, content, owner } = new AddedComments(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
