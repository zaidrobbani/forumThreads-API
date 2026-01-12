const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationTokenManager = require('../../Applications/security/AuthenticationTokenManager');

class JwtTokenManager extends AuthenticationTokenManager {
    constructor(jwt) {
        super();
        this._jwt = jwt;
    }

    async createAccessToken(payload) {
        const token = this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY, {
            ttlSec: 3600, // 1 jam (3600 detik)
        });
        return token;
    }

    async createRefreshToken(payload) {
        const token = this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY, {
            ttlSec: 604800, // 7 hari (604800 detik)
        });
        return token;
    }

    async verifyRefreshToken(token) {
        try {
            const artifacts = this._jwt.decode(token);
            this._jwt.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            
            // Verify expiration
            const { exp } = artifacts.decoded.payload;
            if (exp && Date.now() >= exp * 1000) {
                throw new Error('refresh token expired');
            }
        } catch (error) {
            throw new InvariantError('refresh token tidak valid' + error.message);
        }
    }

    async decodePayload(token) {
        const artifacts = this._jwt.decode(token);
        return artifacts.decoded.payload;
    }
}

module.exports = JwtTokenManager;