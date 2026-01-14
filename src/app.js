require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

let server;

const start = async (req, res) => {
    if (!server) {
        server = await createServer(container);
        await server.initialize();
    }

    server.listener(req, res);
}

start();