import { TresponseErrorMessages, TresponseMessages } from '../types/TApi';

const hashcatIsNotRunning = {
    httpCode: 200,
    message: () => {
        return {
            fail: 'Hashcat is not running',
        };
    },
};
const noElementWithId = {
    httpCode: 200,
    message: () => {
        return {
            fail: 'There is no element with the sended id currently registered',
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
    create: {
        success: {
            httpCode: 200,
            message: () => {
                return {
                    success: 'Eleme',
                };
            },
        },
        fail: hashcatIsNotRunning,
    },
    delete: {
        success: {
            httpCode: 200,
            message: id => {
                return {
                    success: `Deleted the element with id ${id}`,
                };
            },
        },
        fail: noElementWithId,
    },
    update: {
        success: {
            httpCode: 200,
            message: id => {
                return {
                    success: `Updated the element with id ${id}`,
                };
            },
        },
        fail: noElementWithId,
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
