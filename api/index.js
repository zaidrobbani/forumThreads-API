const createServer = require('../src/Infrastructures/http/createServer');
const container = require('../src/Infrastructures/container');

let server;

module.exports = async (req, res) => {
    if (!server) {
        server = await createServer(container);
        await server.initialize();
    }

    server.listener(req, res);
};
