import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service';
import { Container, Row, Col, Spinner, Alert, Button, Collapse, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProveedorDetalles from '../../components/Proveedor/ProveedorDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';
import DefaultEditModal from '../../components/Common/DefaultEditModal';
import proveedorFields from '../../fields/proveedor.fields';
import { exportObjectAndArraysToExcel } from '../../services/export.service';
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
    const [openProductos, setOpenProductos] = useState(false);
    const defaultProfileImage = '../images/proveedor.png';

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

    const handleFormSubmit = async (data) => {
        try {
            // Actualización del proveedor
            const response = await proveedorService.updateProveedor(proveedor.id, data);

            // Refrescar los datos del proveedor actualizado
            const updatedProveedor = await proveedorService.getProveedor(proveedorId);
            setProveedor(updatedProveedor);

            setShowEditModal(false); // Cerrar el modal
            alert('Proveedor actualizado correctamente.');
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error);
            alert(error.response?.data?.message || 'Error al actualizar el proveedor.');
        }
    };

    const handleExport = async () => {
        try {
            const dataObject = {
                "NOMBRE": proveedor.nombre,
                "RUT": proveedor.rut,
                "EMAIL": proveedor.email,
                "TELÉFONO": proveedor.telefono,
                "DIRECCIÓN": proveedor.direccion,
            };

            const sheetNames = {
                mainSheet: "Proveedor",
            };

            const arrayData = [
                ["PRODUCTOS RELACIONADOS"],
                ...(proveedor.productos || []).map(producto => [
                    producto.id,
                    producto.nombre,
                    producto.categoria,
                    producto.precio
                ])
            ];

            await exportObjectAndArraysToExcel(dataObject, arrayData, sheetNames);
            alert('Datos exportados correctamente.');
        } catch (error) {
            console.error('Error al exportar los datos del proveedor:', error);
            alert('Hubo un error al exportar los datos.');
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const toggleDetalles = () => {
        setOpenDetalles(!openDetalles);
        setOpenProductos(false);
    };

    const toggleProductos = () => {
        setOpenProductos(!openProductos);
        setOpenDetalles(false);
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
                    {/* Detalles del proveedor */}
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
                                    <div className="table-responsive">
                                        <ProveedorDetalles proveedor={proveedor} />
                                    </div>
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

                    {/* Productos relacionados */}
                    <Card className={`custom-card ${openProductos ? 'card-active' : ''} mt-4`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Productos Relacionados</h5>
                            <Button
                                onClick={toggleProductos}
                                aria-controls="productos-proveedor"
                                aria-expanded={openProductos}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openProductos ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Collapse in={openProductos}>
                            <div id="productos-proveedor">
                                <Card.Body>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nombre</th>
                                                    <th>Categoría</th>
                                                    <th>Precio</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(proveedor.productos || []).map((producto, index) => (
                                                    <tr key={index}>
                                                        <td>{producto.id}</td>
                                                        <td>{producto.nombre}</td>
                                                        <td>{producto.categoria}</td>
                                                        <td>{producto.precio}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>
                </Col>
            </Row>

            {/* Modal para editar proveedor */}
            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={proveedorFields}
                defaultValues={proveedor}
                onSubmit={handleFormSubmit}
                title="EDITAR PROVEEDOR"
            />
        </Container>
    );
};

export default Proveedor;
