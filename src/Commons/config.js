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
        host : process.env.PGHOST,
        user : process.env.PGUSER,
        database : process.env.PGDATABASE,
        password : process.env.PGPASSWORD,
        port : process.env.PGPORT,
    }
}

module.exports = config;