const InvariantError = require("../InvariantError");

describe('InvariantError', () => {
    it('should create InvariantError correctly', () => {
        const invariantError = new InvariantError('ini adalah error invariant');

        expect(invariantError.statusCode).toEqual(400);
        expect(invariantError.message).toEqual('ini adalah error invariant');
        expect(invariantError.name).toEqual('InvariantError');
    })
})