import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service';
import { Container, Row, Col, Spinner, Alert, Button, Collapse, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProveedorDetalles from '../../components/Proveedor/ProveedorDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';
import DefaultEditModal from '../../components/Common/DefaultEditModal';  // Modal reutilizable
import proveedorFields from '../../fields/proveedor.fields'; // Importa los campos de proveedor
import '../../css/Form.css';
import '../../css/Inventario.css';
import '../../css/Modal.css';

const Proveedor = () => {
    const { proveedorId } = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);
    const defaultProfileImage = '../images/proveedor.png';  // Imagen predeterminada

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const response = await proveedorService.getProveedor(proveedorId);
                setProveedor(response);
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
        console.log("Exportar los datos del proveedor");
    };

    const handleFormSubmit = async (data) => {
        try {
            await proveedorService.updateProveedor(proveedorId, data); // Actualiza el proveedor
            setProveedor({ ...proveedor, ...data });
            setShowEditModal(false);
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error);
        }
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

    if (error) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="form-container">
            <Row className="my-4">
                <Col md={4}>
                    <Image
                        src={proveedor.fotoPerfil || defaultProfileImage}
                        fluid
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            maxHeight: '500px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                    <ButtonsActions
                        itemId={proveedor.id}
                        itemName={proveedor.nombre}
                        onEdit={handleEdit}
                        onExport={handleExport}
                    />
                </Col>
                <Col md={8}>
                    <Card className={`mb-3 custom-card ${openDetalles ? 'card-active' : ''}`}>
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
                </Col>
            </Row>

            {/* Modal para editar el proveedor */}
            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={proveedorFields}  // Campos para el formulario de proveedor
                defaultValues={proveedor}  // Valores predeterminados del proveedor actual
                onSubmit={handleFormSubmit}  // Enviar el formulario
                title="EDITAR PROVEEDOR"
            />
        </Container>
    );
};

export default Proveedor;
