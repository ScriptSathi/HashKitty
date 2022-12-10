import { Response } from 'express';
import { FindRelationsNotFoundError } from 'typeorm';
import {
    TresponseMessagesTypesAgregator,
    TresponsesNamesWitMessagesObjectKeys,
    TresponsesMessagesObjectKeys,
    TresponsesErrorMessagesNames,
} from '../types/TApi';
import {
    responseErrorMessages,
    responseMessagesWithData,
} from './responseMessages';

export class ResponseHandler {
    public tryAndResponse<T extends TresponseMessagesTypesAgregator>(
        responseCode: TresponsesNamesWitMessagesObjectKeys,
        response: Response,
        condition: boolean,
        callbackToTry: () => T
    ): void {
        try {
            if (condition) {
                this.response<T>(
                    responseCode,
                    'success',
                    response,
                    callbackToTry()
                );
            } else {
                this.response<void>(
                    responseCode,
                    'fail',
                    response,
                    (() => {})()
                );
            }
        } catch (err) {
            this.handleCatchErrors(err, response);
        }
    }

    private response<T extends TresponseMessagesTypesAgregator>(
        responseCode: TresponsesNamesWitMessagesObjectKeys,
        statusCode: TresponsesMessagesObjectKeys,
        response: Response,
        data: T
    ): void {
        response
            .status(responseMessagesWithData[responseCode][statusCode].httpCode)
            .json(
                responseMessagesWithData[responseCode][statusCode].message(data)
            );
    }

    private responseError(
        responseCode: TresponsesErrorMessagesNames,
        response: Response
    ): void {
        response
            .status(responseErrorMessages[responseCode].httpCode)
            .json(responseErrorMessages[responseCode].message);
    }

    private handleCatchErrors(err: unknown, response: Response): void {
        if (err instanceof FindRelationsNotFoundError) {
            this.responseError('DBrelationNotFound', response);
        } else {
            this.responseError('unexpectedError', response);
        }
    }
}
