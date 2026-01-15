import NewThread from "../NewThread.js";

describe("NewThread Entities", () => {
  it("should throw when payload not contian needed property", () => {
    // Arrange
    const payload = {
      title: "sebuah thread",
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "sebuah thread",
      body: 123,
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewThread object correctly", () => {
    // Arrange
    const payload = {
      title: "sebuah thread",
      body: "sebuah body thread",
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
