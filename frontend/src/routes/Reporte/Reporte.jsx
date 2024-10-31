import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import reporteService from '../../services/reporte.service';
import { Container, Row, Col, Spinner, Alert, Card, Table, Image, Button } from 'react-bootstrap';
import DefaultEditModal from '../../components/Common/DefaultEditModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../../css/Form.css';
import '../../css/Producto.css';

const Reporte = () => {
    const { reporteId } = useParams();
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);
    const defaultInventarioImage = '../images/inventario.png';

    useEffect(() => {
        const fetchReporte = async () => {
            try {
                const response = await reporteService.getReporte(reporteId);
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

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const toggleDetalles = () => {
        setOpenDetalles(!openDetalles);
    };

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
                    <Button variant="primary" onClick={handleEdit} className="mt-3">
                        Editar Reporte
                    </Button>
                </Col>
                <Col md={8}>
                    <h2>Detalles del Reporte</h2>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>{reporte.id}</td>
                            </tr>
                            <tr>
                                <td>Título</td>
                                <td>{reporte.titulo}</td>
                            </tr>
                            <tr>
                                <td>Descripción</td>
                                <td>{reporte.descripcion}</td>
                            </tr>
                            <tr>
                                <td>Fecha de Creación</td>
                                <td>{new Date(reporte.fecha_creacion).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Estado</td>
                                <td>{reporte.estado}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Card className={`custom-card ${openDetalles ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Detalles del Inventario y Producto</h5>
                            <Button
                                onClick={toggleDetalles}
                                aria-controls="detalles-reporte"
                                aria-expanded={openDetalles}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openDetalles ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {openDetalles && (
                                <>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Inventario</th>
                                                <th>Producto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {reporte.inventario ? (
                                                        <>
                                                            <p><strong>Nombre:</strong> {reporte.inventario.nombre}</p>
                                                            <p><strong>Stock Máximo:</strong> {reporte.inventario.maximo_stock}</p>
                                                            <p><strong>Última Actualización:</strong> {new Date(reporte.inventario.ultima_actualizacion).toLocaleString()}</p>
                                                        </>
                                                    ) : (
                                                        <p>No hay inventario asociado.</p>
                                                    )}
                                                </td>
                                                <td>
                                                    {reporte.producto ? (
                                                        <>
                                                            <p><strong>Nombre:</strong> {reporte.producto.nombre}</p>
                                                            <p><strong>Categoría:</strong> {reporte.producto.categoria}</p>
                                                            <p><strong>Tipo:</strong> {reporte.producto.tipo}</p>
                                                        </>
                                                    ) : (
                                                        <p>No hay producto asociado.</p>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para editar el reporte usando DefaultEditModal */}
            <DefaultEditModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                fields={[]} // Define los campos para editar
                defaultValues={reporte}
                onSubmit={(data) => console.log('Datos enviados para actualizar el reporte:', data)}
                title="EDITAR REPORTE"
            />
        </Container>
    );
};

export default Reporte;
