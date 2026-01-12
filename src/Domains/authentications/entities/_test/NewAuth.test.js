const NewAuth = require('../NewAuth');

describe('NewAuth entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
        };

        // Action and Assert
        expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
            password: 123456,
        };

        // Action and Assert
        expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('should create NewAuth object correctly', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
            password: 'secret',
        };

        // Action
        const { username, password } = new NewAuth(payload);

        // Assert
        expect(username).toEqual(payload.username);
        expect(password).toEqual(payload.password);
    })
})