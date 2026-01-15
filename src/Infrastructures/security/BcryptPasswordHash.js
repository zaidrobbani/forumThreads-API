import PasswordHash from "../../Applications/security/PasswordHash.js";
import AuthenticationError from "../../Commons/exceptions/AuthenticationError.js";

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRounds = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRounds = saltRounds;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRounds);
  }

  async verifyPassword(password, hashedPassword) {
    const match = await this._bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("kredensial yang Anda masukkan salah");
    }
  }
}

export default BcryptPasswordHash;
