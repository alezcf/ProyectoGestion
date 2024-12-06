import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import reporteService from '../../services/reporte.service';
import { Container, Row, Col, Spinner, Alert, Card, Image } from 'react-bootstrap';
import RedireccionBotones from '../../components/Common/ButtonsRedirect';
import ReporteConsolidado from '../../components/Reporte/ReporteDetalles';
import '../../css/Form.css';
import '../../css/DetallesEstandar.css';

const Reporte = () => {
    const { reporteId } = useParams();
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultInventarioImage = '../images/inventario.png';

    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const response = await reporteService.getReporte(reporteId);
                console.log('Reporte:', response);
                if (response) {
                    setReporte(response);
                } else {
                    setError('Reporte no encontrado.');
                }
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos del reporte.');
                setLoading(false);
            }
        };

        fetchReporte();
    }, [reporteId]);

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando reporte...
            </Container>
        );
    }

    if (error || !reporte) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error || 'Reporte no encontrado.'}</Alert>
            </Container>
        );
    }

    // Asegúrate de que el reporte.producto y reporte.inventario estén definidos
    const hasProducto = reporte.producto && reporte.producto.id;
    const hasInventario = reporte.inventario && reporte.inventario.id;

    return (
        <Container fluid className="form-container">
            <Row className="my-4">
                <Col md={4}>
                    <Image
                        src={defaultInventarioImage}
                        fluid
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            maxHeight: '500px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                    <div className="mt-4">
                        {/* Mostrar el botón según los datos disponibles */}
                        {hasProducto && !hasInventario && (
                            <RedireccionBotones
                                ruta1="/producto"
                                texto1="Producto"
                                id1={reporte.producto.id}
                                ruta2={null} // No mostrar segundo botón
                                texto2=""
                                id2=""
                            />
                        )}
                        {hasInventario && !hasProducto && (
                            <RedireccionBotones
                                ruta1="/inventario"
                                texto1="Inventario"
                                id1={reporte.inventario.id}
                                ruta2={null} // No mostrar segundo botón
                                texto2=""
                                id2=""
                            />
                        )}
                        {hasProducto && hasInventario && (
                            <RedireccionBotones
                                ruta1="/producto"
                                ruta2="/inventario"
                                texto1="Producto"
                                texto2="Inventario"
                                id1={reporte.producto.id}
                                id2={reporte.inventario.id}
                            />
                        )}
                    </div>
                </Col>
                <Col md={8}>
                    {/* Resumen del Reporte */}
                    <Card className="mb-3 custom-card">
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Resumen Reporte</h5>
                        </Card.Header>
                        <Card.Body>
                            <ReporteConsolidado reporte={reporte} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Reporte;
