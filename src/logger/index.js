import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let transport = new transports.DailyRotateFile({
    filename: path.join(__dirname, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d'
})

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format.splat()
    ),
    transports: [
        transport
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

export default logger;