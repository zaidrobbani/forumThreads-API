class ClientError extends Error {
    constructor(massage, statusCode = 400) {
        super(massage);

        if(this.constructor.name === 'ClientError') {
            throw new Error('Cannot instance abstract class');
        }
        this.statusCode = statusCode;
        this.name = 'ClientError';
    }
}

module.exports = ClientError;