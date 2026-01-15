import logger from './index.js';
import os from 'os';

export default function loggingMiddleware(req, res, next) {
    res.on('finish', () => {
        const userIP = req.ip || req.connection.remoteAddress
        const payload = res.req.body ? res.req.body : res.req.params || null;
        logger.info(`userIP=${userIP}, host=${os.hostname()}, method=${req.method}, path=${req.path}, payload=${JSON.stringify(payload)}`)
    })
    next();
}

