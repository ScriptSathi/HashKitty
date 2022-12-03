import * as assert from 'assert';

enum ErrorCodes {
    INVALID_COMMAND = 1000,
    UNKNOW_ERROR = 1010,
}

export class HashcatError extends Error {
    public code: ErrorCodes;
    public errorCode: string;

    public static get CODES(): typeof ErrorCodes {
        return ErrorCodes;
    }

    constructor(code: number, message: string) {
        super(`${ErrorCodes[code]}(${code}) ${message}`);
        assert.ok(ErrorCodes[code]);
        this.code = code;
        this.errorCode = `${ErrorCodes[code]}(${code})`;
    }
}
