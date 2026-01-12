const ClientError = require('./ClientError');

class InvariantError extends ClientError {
    constructor(massage) {
        super(massage);

        this.name = 'InvariantError';
    }
}

module.exports = InvariantError;