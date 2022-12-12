import React from 'react';
import { useRouteError } from 'react-router-dom';

import { TuseRouteError } from '../types/THooks';
import logo from '../assets/images/logo.svg';

export default function ErrorPage() {
    const { statusText } = useRouteError() as TuseRouteError;
    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <img src={logo} alt="Logo" />
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{statusText}</i>
            </p>
        </div>
    );
}
