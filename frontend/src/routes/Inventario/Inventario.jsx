import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import inventarioService from '../../services/inventario.service';
import exportService from '../../services/export.service';
import { Container, Row, Col, Spinner, Alert, Button, Collapse, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import InventarioCaracteristicas from '../../components/Inventario/InventarioCaracteristicas';
import InventarioBotones from '../../components/Common/ButtonsActions';
import inventarioFields from '../../fields/inventario.fields';
import DefaultEditModal from '../../components/Common/DefaultEditModal';
import InventarioProducto from '../../components/Inventario/InventarioProducto';
import '../../css/Form.css';
import '../../css/Inventario.css';
import '../../css/Modal.css';

const Inventario = () => {
    const { inventarioId } = useParams();
    const [inventario, setInventario] = useState(null);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);
    const [openProductos, setOpenProductos] = useState(false);
    const defaultInventario = '../images/inventario.png';

    useEffect(() => {
        const fetchInventario = async () => {
            try {
                // Obtener detalles del inventario
                const data = await inventarioService.getInventarioById(inventarioId);

                // Calcular el stock actual sumando las cantidades de productoInventarios
                const stockActual = data.productoInventarios.reduce((total, item) => total + item.cantidad, 0);
                setInventario({ ...data, stock_actual: stockActual });

                // Obtener los productos del inventario
                setProductos(data.productoInventarios);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el inventario o productos.');
                setLoading(false);
            }
        };

        fetchInventario();
    }, [inventarioId]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleExport = async () => {
        try {
            // Estructura para exportar los datos del inventario
            const inventarioData = {
                NOMBRE: inventario.nombre,
                'STOCK ACTUAL': inventario.stock_actual,
                'MÁXIMO STOCK': inventario.maximo_stock,
                'FECHA DE ACTUALIZACIÓN': inventario.ultima_actualizacion,
            };

            const productosExport = productos.map(productoInventario => ({
                "NOMBRE DEL PRODUCTO": productoInventario.producto.nombre,
                MARCA: productoInventario.producto.marca,
                DESCRIPCIÓN: productoInventario.producto.descripcion,
                CATEGORÍA: productoInventario.producto.categoria,
                TIPO: productoInventario.producto.tipo,
                CANTIDAD: productoInventario.cantidad
            }));

            const sheetNames = {
                mainSheet: "Inventario",
                arraySheet1: "Productos"
            };

            await exportService.exportObjectAndArraysToExcel(inventarioData, [productosExport], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del inventario:', error);
            alert('Error al exportar los datos.');
        }
    };

    const handleFormSubmit = async (data) => {
        const inventarioActualizado = { ...inventario, ...data };

        try {
            await inventarioService.updateInventario(inventarioId, inventarioActualizado);
            console.log('Inventario actualizado con éxito:', inventarioActualizado);
            setInventario(inventarioActualizado);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error al actualizar el inventario:', error);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const toggleDetalles = () => {
        setOpenDetalles(true);
        setOpenProductos(false);
    };

    const toggleProductos = () => {
        setOpenProductos(true);
        setOpenDetalles(false);
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando inventario...
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
                        src={inventario.fotoPerfil || defaultInventario}
                        fluid
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            maxHeight: '500px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                    <InventarioBotones onEdit={handleEdit} onExport={handleExport} />
                </Col>
                <Col md={8}>
                    <Card className={`mb-3 custom-card ${openDetalles ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Características generales</h5>
                            <Button
                                onClick={toggleDetalles}
                                aria-controls="detalles-inventario"
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
                            <div id="detalles-inventario">
                                <Card.Body>
                                    <InventarioCaracteristicas inventario={inventario} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

                    <Card className={`custom-card ${openProductos ? 'card-active' : ''} mt-4`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Productos en el Inventario</h5>
                            <Button
                                onClick={toggleProductos}
                                aria-controls="productos-inventario"
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
                            <div id="productos-inventario">
                                <Card.Body>
                                    <InventarioProducto inventario={inventario} productos={productos} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>
                </Col>
            </Row>

            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={inventarioFields}
                defaultValues={inventario}
                onSubmit={handleFormSubmit}
                title="EDITAR INVENTARIO"
            />
        </Container>
    );
};

export default Inventario;
