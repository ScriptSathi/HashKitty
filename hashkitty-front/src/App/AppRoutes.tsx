import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import HomePage from '../pages/HomePage/HomePage';
import Templates from '../pages/Templates/Templates';
import Lists from '../pages/Lists/Lists';

export default function AppRoutes() {
   const appRouter = createBrowserRouter([
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
               element: <Templates />,
            },
            {
               path: 'lists',
               element: <Lists />,
            },
         ],
      },
   ]);
   return <RouterProvider router={appRouter} />;
}
