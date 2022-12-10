import {
    TresponseErrorMessages,
    TresponseMessages,
    TresponseMessageWithData,
} from '../types/TApi';

const hashcatIsNotRunning: TresponseMessageWithData<void> = {
    httpCode: 200,
    message: () => {
        return {
            fail: 'Hashcat is not running',
        };
    },
};

export const responseMessagesWithData: TresponseMessages = {
    status: {
        success: {
            httpCode: 200,
            message: data => {
                return {
                    success: data || 'Success',
                };
            },
        },
        fail: hashcatIsNotRunning,
    },
    stop: {
        success: {
            httpCode: 200,
            message: () => {
                return {
                    success: 'Hashcat stopped successfully',
                };
            },
        },
        fail: hashcatIsNotRunning,
    },
    exec: {
        success: {
            httpCode: 200,
            message: () => {
                return {
                    success: 'Hashcat started successfully',
                };
            },
        },
        fail: hashcatIsNotRunning,
    },
};

export const responseErrorMessages: TresponseErrorMessages = {
    DBrelationNotFound: {
        httpCode: 200,
        message: {
            error: 'The Entity was not found in the database. Verify the requested params',
        },
    },
    unexpectedError: {
        httpCode: 200,
        message: {
            error: 'An unexpected error occurred, please contact the administrator',
        },
    },
};
