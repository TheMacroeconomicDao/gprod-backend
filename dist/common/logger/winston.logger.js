"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = void 0;
const winston = require("winston");
class WinstonLogger {
    logger;
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)),
            transports: [new winston.transports.Console()],
        });
    }
    log(message) {
        this.logger.info(message);
    }
    error(message, trace) {
        this.logger.error(`${message} ${trace || ''}`);
    }
    warn(message) {
        this.logger.warn(message);
    }
    debug(message) {
        this.logger.debug(message);
    }
    verbose(message) {
        this.logger.verbose(message);
    }
}
exports.WinstonLogger = WinstonLogger;
//# sourceMappingURL=winston.logger.js.map