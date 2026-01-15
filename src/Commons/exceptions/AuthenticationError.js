import ClientError from "./ClientError.js";

class AuthenticationError extends ClientError {
  constructor(massage) {
    super(massage, 401);

    this.name = "AuthenticationError";
  }
}

export default AuthenticationError;
