import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login/Login.jsx';
import Perfil from './routes/Perfil/Perfil.jsx';
import Inventario from './routes/Inventario/Inventario.jsx';
import Producto from './routes/Producto/Producto.jsx';
import Productos from './routes/Producto/Productos.jsx';
import Reporte from './routes/Reporte/Reporte.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/inventario',
        element: <Inventario />,
      },
      {
        path: '/producto/:productoId',
        element: <Producto />,
      },
      {
        path: '/producto',
        element: <Productos />,
      },
      {
        path: '/reporte',
        element: <Reporte />,
      },
      {
        path: '/perfil',
        element: <Perfil />,
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
