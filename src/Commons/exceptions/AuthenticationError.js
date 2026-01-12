const ClientError = require('./ClientError');

class InvariantError extends ClientError {
    constructor(massage) {
        super(massage, 401);

        this.name = 'AuthenticationError';
    }
}

module.exports = InvariantError;