import { Response } from 'express';
import { FindRelationsNotFoundError } from 'typeorm';
import {
    TresponseMessagesTypesAgregator,
    TresponsesNamesWitMessagesObjectKeys,
    TresponsesErrorMessagesNames,
    TresponsesNamesMessagesObjectKeys,
    AllowedResponseFormat,
} from '../types/TApi';
import {
    responseErrorMessages,
    responseMessagesWithData,
} from './responseMessages';

export class ResponseHandler {
    public tryAndResponse<
        Props extends TresponseMessagesTypesAgregator,
        ResponseFormat extends AllowedResponseFormat
    >(
        responseCode: TresponsesNamesWitMessagesObjectKeys,
        response: Response,
        condition: boolean,
        callbackToTry: () => Props
    ): void {
        try {
            if (condition) {
                this.response<Props, ResponseFormat>(
                    responseCode,
                    'success',
                    response,
                    callbackToTry()
                );
            } else {
                this.response<void, string>(
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

    private response<
        Props extends TresponseMessagesTypesAgregator,
        ResponseFormat extends AllowedResponseFormat
    >(
        responseCode: TresponsesNamesWitMessagesObjectKeys,
        statusCode: keyof TresponsesNamesMessagesObjectKeys<ResponseFormat>,
        response: Response,
        data: Props
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
