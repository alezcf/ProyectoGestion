import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';
import '../css/Buttons.css';

function Dashboard() {
    return (
        <Container fluid className="dashboard-container">
            <Row>
                <Col md={6} lg={4}>
                    <Card className="mb-4 dashboard-card inventory-card text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Title className="dashboard-card-title">Resumen de Inventario</Card.Title>
                            <Card.Text className="flex-grow-1">
                                Niveles actuales de inventario, productos con bajo stock y productos más vendidos.
                            </Card.Text>
                            <Link to="/inventario" className="signup-button mt-auto">Ver más</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="mb-4 dashboard-card alerts-card text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Title className="dashboard-card-title">Alertas y Notificaciones</Card.Title>
                            <Card.Text className="flex-grow-1">
                                Alertas de reabastecimiento y solicitudes de nuevos registros.
                            </Card.Text>
                            <Link to="/reporte" className="signup-button mt-auto">Ver más</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="mb-4 dashboard-card stats-card text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Title className="dashboard-card-title">Estadísticas Clave</Card.Title>
                            <Card.Text className="flex-grow-1">
                                Gráficas de ventas diarias, semanales y mensuales.
                            </Card.Text>
                            <Link to="/estadisticas" className="signup-button mt-auto">Ver más</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="mb-4 dashboard-card profile-card text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Title className="dashboard-card-title">Proveedores</Card.Title>
                            <Card.Text className="flex-grow-1">
                                Registro de los proveedores recurrentes.
                            </Card.Text>
                            <Link to="/proveedores" className="signup-button mt-auto">Ver</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="mb-4 dashboard-card profile-card text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Title className="dashboard-card-title">Trabajadores</Card.Title>
                            <Card.Text className="flex-grow-1">
                                Registro de todos los trabajadores registrados en la plataforma.
                            </Card.Text>
                            <Link to="/trabajadores" className="signup-button mt-auto">Ver</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="mb-4 dashboard-card profile-card text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Card.Title className="dashboard-card-title">Perfil del Usuario</Card.Title>
                            <Card.Text className="flex-grow-1">
                                Información básica del usuario autentificado.
                            </Card.Text>
                            <Link to="/perfil" className="signup-button mt-auto">Ver</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;
