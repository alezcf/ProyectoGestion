import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service';
import { Container, Row, Col, Spinner, Alert, Button, Modal, Collapse, Card } from 'react-bootstrap';
import ProveedorDetalles from '../../components/Proveedor/ProveedorDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../../css/Form.css';
import '../../css/Producto.css';

const Proveedor = () => {
    const { proveedorId } = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const response = await proveedorService.getProveedor(proveedorId);

                if (response) {
                    setProveedor(response);
                } else {
                    setError('Proveedor no encontrado.');
                }
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos del proveedor.');
                setLoading(false);
            }
        };

        fetchProveedor();
    }, [proveedorId]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleExport = () => {
        console.log('Exportar los datos del proveedor');
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const toggleDetalles = () => {
        setOpenDetalles(!openDetalles);
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando proveedor...
            </Container>
        );
    }

    if (error || !proveedor) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error || 'Proveedor no encontrado.'}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="form-container">
            <center><h2>Información del Proveedor</h2></center>
            <Row className="my-4">
                <Col md={4}>
                    {/* Mostrar los detalles del proveedor */}
                    <Card className={`custom-card ${openDetalles ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Detalles del Proveedor</h5>
                            <Button
                                onClick={toggleDetalles}
                                aria-controls="detalles-proveedor"
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
                        <Collapse in={openDetalles}>
                            <div id="detalles-proveedor">
                                <Card.Body>
                                    <ProveedorDetalles proveedor={proveedor} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>
                    <ButtonsActions
                        itemId={proveedor.id}
                        itemName={proveedor.nombre}
                        onEdit={handleEdit}
                        onExport={handleExport}
                    />
                </Col>
            </Row>

            {/* Modal para editar los datos del proveedor */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Proveedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Aquí puedes incluir el formulario de edición del proveedor.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Proveedor;
