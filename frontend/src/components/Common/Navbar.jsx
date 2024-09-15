import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Navbar.css';
import '../../css/Buttons.css';
import BotilleriaLogo from '../../images/BotilleriaLogo.png';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <BootstrapNavbar variant="dark" expand="lg" className="navbar">
      <Container fluid>
        <BootstrapNavbar.Brand href="/">
          <img
            src={BotilleriaLogo}
            alt="Logo de Mi Aplicación"
            className="brand-logo"
          />
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto nav-links">
            <Nav.Link href="/" className="nav-link">Inicio</Nav.Link>
            <Nav.Link href="/usuarios" className="nav-link">Usuarios</Nav.Link>
            <Nav.Link href="/inventario" className="nav-link">Inventario</Nav.Link>
            <Nav.Link href="/producto" className="nav-link">Productos</Nav.Link>
            <Nav.Link href="/reporte" className="nav-link">Reportes</Nav.Link>
            <Nav.Link href="/perfil" className="nav-link">Perfil</Nav.Link>
            <Nav.Link href="/proveedor" className="nav-link">Proveedores</Nav.Link>
            <div className="user-info">
            <button onClick={handleLogout} className="button logout-button">Cerrar sesión</button>
            </div>
          </Nav>

        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
