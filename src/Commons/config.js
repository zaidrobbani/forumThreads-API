const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'test') {
    dotenv.config({
        path: path.resolve(__dirname, '../../.test.env'),
    })
} else {
    dotenv.config();
}

const config = {
    app: {
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.APP_HOST,
        port: process.env.PORT,
        debug: process.env.NODE_ENV !== 'development' ? {request: ['error']} : {},
    },
    database : {
        connectionString : process.env.DATABASE_URL,
        max: 1,
        ssl: {
            rejectUnauthorized: false,
        }
    }
}

module.exports = config;