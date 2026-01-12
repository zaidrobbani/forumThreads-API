const LoginUserUseCase = require('../LoginUserUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/authenticationsRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');

describe('LoginUserUseCase', () => {
    // Test 1: Orchestrating - pastikan semua dependency dipanggil dengan benar
    it('should orchestrating the login action correctly', async () => {
        // Arrange
        const useCasePayload = {
            username: 'dicoding',
            password: 'secret',
        };
        
        // Arrange: expected values
        const expectedAuthentication = {
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
        };
        
        // Mock dependencies - TODO: buat mock untuk semua dependency
        const mockUserRepository = new UserRepository();
        const mockAuthenticationRepository = new AuthenticationRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        const mockPasswordHash = new PasswordHash();
        
        // TODO: Mock method getPasswordByUsername
        mockUserRepository.getPasswordByUsername = jest.fn()
            .mockImplementation(() => Promise.resolve('encrypted_password'));
        
        // TODO: Mock method getIdByUsername
        mockUserRepository.getIdByUsername = jest.fn()
            .mockImplementation(() => Promise.resolve('user-123'));
        
        // TODO: Mock method verifyPassword (atau comparePassword, sesuai nama di kamu)
        mockPasswordHash.verifyPassword = jest.fn()
            .mockImplementation(() => Promise.resolve());
        
        // TODO: Mock method createAccessToken (atau createAccesToken sesuai typo kamu)
        mockAuthenticationTokenManager.createAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve('access_token'));
        
        // TODO: Mock method createRefreshToken
        mockAuthenticationTokenManager.createRefreshToken = jest.fn()
            .mockImplementation(() => Promise.resolve('refresh_token'));
        
        // TODO: Mock method addToken
        mockAuthenticationRepository.addToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        
        // Create use case instance
        const loginUserUseCase = new LoginUserUseCase({
            userRepository: mockUserRepository,
            authenticationsRepository: mockAuthenticationRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
            passwordHash: mockPasswordHash,
        });
        
        // Action
        const actualAuthentication = await loginUserUseCase.execute(useCasePayload);
        
        // Assert
        expect(actualAuthentication).toEqual(expectedAuthentication);
        
        // Assert: pastikan semua method dipanggil dengan parameter yang benar
        expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('dicoding');
        expect(mockPasswordHash.verifyPassword).toHaveBeenCalledWith('secret', 'encrypted_password');
        expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('dicoding');
        expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
        expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
        expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith('refresh_token');
    });
});