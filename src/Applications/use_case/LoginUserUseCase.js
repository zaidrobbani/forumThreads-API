const NewAuth = require("../../Domains/authentications/entities/NewAuth");
const NewAuthentications = require("../../Domains/authentications/entities/NewAuthentications");

class LoginUserUseCase {
  constructor({
    userRepository,
    authenticationsRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authenticationsRepository = authenticationsRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    // Buat NewAuth Entity
    const { username, password } = new NewAuth(useCasePayload);

    // Abil credential dari userRepository
    const hashedPassword = await this._userRepository.getPasswordByUsername(
      username
    );

    // verify password dengan passwordhash
    await this._passwordHash.verifyPassword(password, hashedPassword);

    // ambil id dari result
    const id = await this._userRepository.getIdByUsername(username);

    // Generate access token & refresh token
    const accessToken =
      await this._authenticationTokenManager.createAccessToken({
        username,
        id,
      });
    const refreshToken =
      await this._authenticationTokenManager.createRefreshToken({
        username,
        id,
      });

    await this._authenticationsRepository.addToken(refreshToken);

    return new NewAuthentications({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
}

module.exports = LoginUserUseCase;
