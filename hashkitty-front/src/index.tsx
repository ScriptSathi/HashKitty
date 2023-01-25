import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './pages/HomePage';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/ErorrPage';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'home',
                element: <HomePage />,
            },
            {
                path: 'lists',
                element: <HomePage />,
            },
            {
                path: 'template-tasks',
                element: <HomePage />,
            },
            {
                path: 'server-infos',
                element: <HomePage />,
            },
        ],
    },
]);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
