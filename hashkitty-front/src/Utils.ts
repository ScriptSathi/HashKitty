import { ChangeEvent } from 'react';
import { Constants } from './Constants';

export class Utils {
    public static santizeInput(
        event:
            | ChangeEvent<HTMLInputElement>
            | (React.MouseEvent<HTMLInputElement, MouseEvent> &
                  ChangeEvent<HTMLInputElement>)
    ): string | number | boolean {
        return event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value.replace(' ', '-').replace(/[^\w._-]/gi, '');
    }

    public static async fetchListWithEndpoint<List>(
        endpoint: string
    ): Promise<List[]> {
        const req = await (
            await fetch(endpoint, Constants.mandatoryFetchOptions)
        ).json();
        return req && req.success && req.success.length > 0 ? req.success : [];
    }
}
