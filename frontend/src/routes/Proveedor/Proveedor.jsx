import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service';
import ProductoProveedor from '../../services/productoProveedor.service';
import { Container, Row, Col, Spinner, Alert, Button, Card, Image, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProveedorDetalles from '../../components/Proveedor/ProveedorDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';
import DefaultEditModal from '../../components/Common/DefaultEditModal';
import ProveedorProducto from '../../components/Proveedor/ProveedorProducto';
import proveedorFields from '../../fields/proveedor.fields';
import exportService from '../../services/export.service';
import '../../css/Form.css';
import '../../css/Inventario.css';
import '../../css/Modal.css';
import '../../css/Buttons.css';

const Proveedor = () => {
    const { proveedorId } = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);
    const defaultProfileImage = '../images/proveedor.png';

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const response = await proveedorService.getProveedor(proveedorId);
                setProveedor(response);

                const productosResponse = await ProductoProveedor.getProductosByProveedor(proveedorId);
                console.log('Productos del proveedor:', productosResponse);
                setProductos(productosResponse.data.data);

                setLoading(false);
            } catch (err) {
                console.error('Error al cargar el proveedor:', err);
                setLoading(false);
            }
        };

        fetchProveedor();
    }, [proveedorId]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleExport = async () => {
        try {
            // Estructura para exportar el proveedor
            const proveedorData = {
                NOMBRE: proveedor.nombre,
                RUT: proveedor.rut,
                EMAIL: proveedor.email,
                TELÉFONO: proveedor.telefono,
                DIRECCIÓN: proveedor.direccion,
            };

            // Exportar productos asociados al proveedor
            const productosData = productos.map(producto => ({
                NOMBRE: producto.nombre,
                DESCRIPCIÓN: producto.descripcion,
                MARCA: producto.marca,
                CONTENIDO: producto.contenido,
                'UNIDAD DE MEDIDA': producto.unidad_medida,
                TIPO: producto.tipo,
                PRECIO: producto.precio,
                'CATEGORÍA': producto.categoria || 'No registrada',
            }));

            // Nombres personalizados para las hojas de Excel
            const sheetNames = {
                mainSheet: "Proveedor",       // Nombre de la hoja principal (datos del proveedor)
                arraySheet1: "Productos"       // Nombre de la hoja para productos
            };

            // Llamar al servicio de exportación para generar el archivo Excel con nombres de hoja personalizados
            await exportService.exportObjectAndArraysToExcel(proveedorData, [productosData], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del proveedor:', error);
            alert('Error al exportar los datos.');
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            await proveedorService.updateProveedor(proveedor.id, data);
            const updatedProveedor = await proveedorService.getProveedor(proveedorId);
            setProveedor(updatedProveedor);
            setShowEditModal(false);
            alert('Proveedor actualizado correctamente.');
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error);
            alert(error.response?.data?.message || 'Error al actualizar el proveedor.');
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
                    <ProveedorProducto
                        proveedorId={proveedorId}
                    />
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
