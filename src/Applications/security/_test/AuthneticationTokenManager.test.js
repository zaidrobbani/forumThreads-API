const AuthenticationTOkenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManagerInterface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const authenticationTokenManager = new AuthenticationTOkenManager();

        // Action & Assert
        await expect(authenticationTokenManager.createAccessToken({})).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
        await expect(authenticationTokenManager.createRefreshToken({})).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
        await expect(authenticationTokenManager.verifyAccessToken('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
        await expect(authenticationTokenManager.verifyRefreshToken('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    })
})