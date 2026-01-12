const root = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
    async addToken(token) {
        const query = {
            text: 'INSERT INTO authentications(token) VALUES($1)',
            values: [token],
        };

        await root.query(query);
    },

    async findToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };

        const result = await root.query(query);
        return result.rows;
    },

    async cleanTable() {
        const query = {
            text: 'TRUNCATE TABLE authentications CASCADE'
        };

        await root.query(query);
    }
}

module.exports = AuthenticationsTableTestHelper;