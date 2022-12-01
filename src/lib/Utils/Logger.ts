import * as winston from 'winston';

const { combine, timestamp, printf } = winston.format;

function getStackTrace(): string {
    const obj: {stack?: string} = {};
    Error.captureStackTrace(obj, getStackTrace);
    Error.stackTraceLimit = 12;
    return obj.stack || '';
}

const getLine = () => {
    getStackTrace(); // A first empty call is needed to avoid partial trace
    const fullStackTrace = getStackTrace()?.split('\n') || [''];
    const extractedLine = fullStackTrace.slice(-1)[0].split('/').slice(-1);
    const cleaning = extractedLine[extractedLine.length - 1].split(':');
    return cleaning[0] + ':' + cleaning[1];
};

const customFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} [${getLine()}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: new Date()
                .toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, ''),
        }),
        customFormat
    ),
    defaultMeta: {service: 'user-service'},
    transports: [new winston.transports.Console()],
});
