class NewAuth {
  constructor(payload) {
    this._verifyPayload(payload);

    const { username, password } = payload;

    this.username = username;
    this.password = password;
  }

  _verifyPayload(payload) {
    const { username, password } = payload;

    if (!username || !password) {
      throw new Error("NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof username !== "string" || typeof password !== "string") {
      throw new Error("NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

export default NewAuth;
