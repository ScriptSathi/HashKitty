import { Constants } from './Constants';

export class RequestUtils {
    public static POST<
        ResponseType extends {
            [key: string]: string | Object | number | boolean | string[];
        }
    >(
        url: string,
        data: Object,
        callback: (response: ResponseType) => void
    ): void {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            ...Constants.mandatoryFetchOptions,
        };
        fetch(url, requestOptions)
            .then(response => {
                return response.json();
            })
            .then(res => {
                callback(res);
            });
    }
}
