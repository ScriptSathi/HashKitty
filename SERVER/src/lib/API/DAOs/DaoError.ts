import * as assert from 'assert';
import { FindRelationsNotFoundError } from 'typeorm';

enum ErrorCodes {
    NO_ENTRY_IN_DB = 1000,
    UNKNOW_ERROR = 1010,
}

export class DAOError extends Error {
    public code: ErrorCodes;
    public errorCode: string;

    public static get CODES(): typeof ErrorCodes {
        return ErrorCodes;
    }

    public static checkStderr(stderr: unknown): DAOError {
        if (stderr instanceof FindRelationsNotFoundError) {
            return new DAOError(
                DAOError.CODES.NO_ENTRY_IN_DB,
                'Cluster already exists'
            );
        } else {
            return new DAOError(
                DAOError.CODES.UNKNOW_ERROR,
                'An unexpected error occurred\n' + stderr
            );
        }
    }

    constructor(code: number, message: string) {
        super(`${ErrorCodes[code]}(${code}) ${message}`);
        assert.ok(ErrorCodes[code]);
        this.code = code;
        this.errorCode = `${ErrorCodes[code]}(${code})`;
    }
}
