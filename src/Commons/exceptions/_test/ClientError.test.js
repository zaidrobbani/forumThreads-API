const ClientError = require("../ClientError");

describe("ClientError", () => {
  it("should throw error when directly use it", () => {
    expect(() => new ClientError("")).toThrow("Cannot instance abstract class");
  });
});
