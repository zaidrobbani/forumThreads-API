const DetailThread = require('../Detailthread');

describe('DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'ini adalah body thread',
            date: '2024-06-10T07:00:00.000Z',
            username: 'johndoe',
        };          
        // Action and Assert
        expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'ini adalah body thread',
            date: '2024-06-10T07:00:00.000Z',
            username: 'johnd    oe',
            comments: 'this is comments',
        };

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'ini adalah body thread',
            date: '2024-06-10T07:00:00.000Z',
            username: 'johndoe',
            comments: [],
        };

        // Action
        const detailThread = new DetailThread(payload);

        // Assert
        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.date);
        expect(detailThread.username).toEqual(payload.username);
        expect(detailThread.comments).toEqual(payload.comments);
    });
})