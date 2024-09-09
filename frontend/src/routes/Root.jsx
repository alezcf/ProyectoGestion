import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Root.css'; // Importa los estilos específicos para Root
import '../css/Navbar.css'; // Importa los estilos específicos para Navbar

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <div className="main-content"><Navbar />
      <div className="root-container">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Root;
