import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';

import HomePage from './pages/HomePage/HomePage';
import ErrorPage from './pages/ErrorPage/ErrorPage';

import './assets/styles/main.scss';

const theme = createTheme({
   components: {
      MuiSwitch: {
         styleOverrides: {
            track: {
               backgroundColor: 'black',
            },
            root: {
               '& .MuiSwitch-colorSecondary': {
                  color: 'black',
               },
            },
         },
      },
   },
   palette: {
      primary: {
         main: '#FFFFF',
      },
      secondary: {
         main: '#FC6F6F',
      },
   },
} as ThemeOptions);

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
            element: <HomePage />,
         },
         {
            path: 'lists',
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
      <ThemeProvider theme={theme}>
         <RouterProvider router={router} />
      </ThemeProvider>
   </React.StrictMode>,
);
