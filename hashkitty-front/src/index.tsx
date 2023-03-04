import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Template from './pages/Template/Template';
import Lists from './pages/Lists/Lists';
import ServerInfos from './pages/ServerInfos';

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement,
);
const router = createBrowserRouter([
   {
      errorElement: <ErrorPage />,
      children: [
         {
            path: '',
            element: <HomePage />,
         },
         {
            path: 'home',
            element: <HomePage />,
         },
         {
            path: 'templates',
            element: <Template />,
         },
         {
            path: 'lists',
            element: <Lists />,
         },
         {
            path: 'server-infos',
            element: <ServerInfos />,
         },
      ],
   },
]);
root.render(
   <React.StrictMode>
      <RouterProvider router={router} />
   </React.StrictMode>,
);
