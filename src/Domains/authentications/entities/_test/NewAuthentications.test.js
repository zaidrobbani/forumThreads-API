const NewAuthentications = require('../NewAuthentications');

describe('NewAuthentications entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            accessToken: 'someToken',
        };          
        // Action and Assert
        expect(() => new NewAuthentications(payload)).toThrow('NEW_AUTHENTICATIONS.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            accessToken: 'someToken',
            refreshToken: 123456,
        };

        // Action and Assert
        expect(() => new NewAuthentications(payload)).toThrow('NEW_AUTHENTICATIONS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('should create NewAuthentications object correctly', () => {
        // Arrange
        const payload = {
            accessToken: 'someToken',
            refreshToken: 'someRefreshToken',
        };

        // Action
        const { accessToken, refreshToken } = new NewAuthentications(payload);

        // Assert
        expect(accessToken).toEqual(payload.accessToken);
        expect(refreshToken).toEqual(payload.refreshToken);
    })
})