import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllReportes, eliminarReporte } from '../logic/reporte.logic';
import { formatDate, formatTime } from '../logic/format.logic';
import '../css/Buttons.css';

const Reporte = () => {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllReportes(setReportes, setError);
    }, []);

    const handleEliminarNotificacion = (reporteId) => {
        eliminarReporte(reporteId, setReportes, setError, reportes);
    };

    if (error) {
        return <Alert variant="danger" className="text-center">Error: {error}</Alert>;
    }

    if (reportes.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="reportes-container">
            <Row>
                {reportes.map((reporte, index) => (
                    <Col md={6} lg={4} key={index}>
                        <Card className="mb-4 reporte-card text-center">
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Card.Title className="reporte-card-title">{reporte.titulo}</Card.Title>
                                <Card.Text className="flex-grow-1">{reporte.descripcion}</Card.Text>
                                <Card.Text><strong>Importancia:</strong> {reporte.importancia}</Card.Text>
                                <Card.Text><strong>Fecha:</strong> {formatDate(reporte.fecha)}</Card.Text>
                                <Card.Text><strong>Hora:</strong> {formatTime(reporte.fecha)}</Card.Text>
                                <Card.Text><strong>Producto Asignado:</strong> {reporte.productoAsignado.nombre}</Card.Text>
                                <Link to={`/producto/${reporte.productoAsignado._id}`} className="login-button mt-auto">Ver producto</Link>
                                <button type="submit" className="recover-button" onClick={() => handleEliminarNotificacion(reporte._id)}>Eliminar reporte</button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Reporte;
