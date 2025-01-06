import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login/Login.jsx';
import Perfil from './routes/Perfil/Perfil.jsx';
import Inventarios from './routes/Inventario/Inventarios.jsx';
import Inventario from './routes/Inventario/Inventario.jsx';
import Producto from './routes/Producto/Producto.jsx';
import Productos from './routes/Producto/Productos.jsx';
import Reporte from './routes/Reporte/Reporte.jsx';
import Usuario from './routes/Usuario/Usuario.jsx';
import CrearUsuario from './routes/Usuario/CrearUsuario.jsx';
import CrearPedido from './routes/Pedido/CrearPedido.jsx';
import CrearProducto from './routes/Producto/CrearProducto.jsx';
import CrearInventario from './routes/Inventario/CrearInventario.jsx';
import CrearProveedor from './routes/Proveedor/CrearProveedor.jsx';
import Usuarios from './routes/Usuario/Usuarios.jsx';
import Pedido from './routes/Pedido/Pedido.jsx';
import Pedidos from './routes/Pedido/Pedidos.jsx';
import Proveedores from './routes/Proveedor/Proveedores.jsx';
import Proveedor from './routes/Proveedor/Proveedor.jsx';
import ResetPassword from './routes/Usuario/ResetPassword.jsx';


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
        path: '/inventarios',
        element: <Inventarios />,
      },
      {
        path: '/inventario/:inventarioId',
        element: <Inventario />,
      },
      {
        path: '/producto/:productoId',
        element: <Producto />,
      },
      {
        path: '/productos',
        element: <Productos />,
      },
      {
        path: '/pedidos',
        element: <Pedidos />,
      },
      {
        path: '/crear-pedido',
        element: <CrearPedido />,
      },
      {
        path: '/crear-producto',
        element: <CrearProducto />,
      },
      {
        path: '/crear-proveedor',
        element: <CrearProveedor />,
      },
      {
        path: '/crear-inventario',
        element: <CrearInventario />,
      },
      {
        path: '/pedido/:pedidoId',
        element: <Pedido />,
      },
      {
        path: '/reporte/:reporteId',
        element: <Reporte />,
      },
      {
        path: '/crear-usuario',
        element: <CrearUsuario />,
      },
      {
        path: '/usuarios',
        element: <Usuarios />,
      },
      {
        path: '/usuario/:usuarioId',
        element: <Usuario />,
      },
      {
        path: '/proveedores',
        element: <Proveedores />,
      },
      {
        path: '/proveedor/:proveedorId',
        element: <Proveedor />,
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
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
