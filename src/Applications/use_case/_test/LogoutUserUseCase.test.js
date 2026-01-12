const LogoutUserUseCase = require('../LogoutUserUseCase');
const AuthenticationRepository = require('../../../Domains/authentications/authenticationsRepository');

describe('LogoutUserUseCase', () => {
    // Test 1: Harus throw error jika tidak ada refresh token
    it('should throw error if use case payload not contain refresh token', async () => {
        // Arrange
        const useCasePayload = {};
        const logoutUserUseCase = new LogoutUserUseCase({});

        // Action & Assert
        await expect(logoutUserUseCase.execute(useCasePayload))
            .rejects
            .toThrow('LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    });

    // Test 2: Harus throw error jika refresh token bukan string
    it('should throw error if refresh token not string', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 123,
        };
        const logoutUserUseCase = new LogoutUserUseCase({});

        // Action & Assert
        await expect(logoutUserUseCase.execute(useCasePayload))
            .rejects
            .toThrow('LOGOUT_USER_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    // Test 3: Harus orchestrating dengan benar
    it('should orchestrating the delete authentication action correctly', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 'refreshToken',
        };
        const mockAuthenticationRepository = new AuthenticationRepository();
        mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationRepository.deleteToken = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const logoutUserUseCase = new LogoutUserUseCase({
            authenticationRepository: mockAuthenticationRepository,
        });

        // Action
        await logoutUserUseCase.execute(useCasePayload);

        // Assert
        expect(mockAuthenticationRepository.checkAvailabilityToken)
            .toHaveBeenCalledWith(useCasePayload.refreshToken);
        expect(mockAuthenticationRepository.deleteToken)
            .toHaveBeenCalledWith(useCasePayload.refreshToken);
    });
});