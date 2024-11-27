import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pedidoService from '../../services/pedido.service';
import exportService from '../../services/export.service';
import { Container, Row, Col, Spinner, Alert, Button, Collapse, Card, Image } from 'react-bootstrap';
import PedidoDetalles from '../../components/Pedido/PedidoDetalles';
import PedidoProducto from '../../components/Pedido/PedidoProducto'; // Importamos el nuevo componente
import ButtonsActions from '../../components/Common/ButtonsActions';
import DefaultEditModal from '../../components/Common/DefaultEditModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import pedidoFields from '../../fields/pedido.fields';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic';
import '../../css/Form.css';
import '../../css/Producto.css';

const Pedido = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);
    const [openProductos, setOpenProductos] = useState(false);
    const defaultInventario = '../images/inventario.png';

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await pedidoService.getPedido(pedidoId);
                if (response) {
                    setPedido(response);
                } else {
                    setError('Pedido no encontrado.');
                }
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos del pedido.');
                setLoading(false);
            }
        };

        fetchPedido();
    }, [pedidoId]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleExport = async () => {
        try {
            const productosExport = pedido.pedidoProductos.map(productoPedido => ({
                "NOMBRE DEL PRODUCTO": productoPedido.producto.nombre,
                CANTIDAD: productoPedido.cantidad,
                PRECIO: productoPedido.precio,
                SUBTOTAL: productoPedido.cantidad * productoPedido.precio
            }));

            const totalCost = productosExport.reduce((acc, producto) => acc + producto.SUBTOTAL, 0);

            const pedidoData = {
                "NÚMERO": pedido.id,
                'ESTADO ACTUAL': pedido.estado,
                'FECHA DEL PEDIDO': formatDateToDDMMYYYY(pedido.fecha_pedido),
                'TOTAL DEL PEDIDO': `$${totalCost}`,
            };

            const sheetNames = {
                mainSheet: "Pedido",
                arraySheet1: "Productos"
            };

            await exportService.exportObjectAndArraysToExcel(pedidoData, [productosExport], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del pedido:', error);
            alert('Error al exportar los datos.');
        }
    };

    const handleFormSubmit = async (data) => {
        const pedidoActualizado = { ...pedido, ...data };
        console.log('Pedido actualizado:', pedidoActualizado);
        try {
            await pedidoService.updatePedido(pedidoId, pedidoActualizado);
            setPedido(pedidoActualizado);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
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

    const handleInfo = (productoId) => {
        navigate(`/producto/${productoId}`);
    };

    const handleDelete = async (productoId) => {
        try {
            await pedidoService.deleteProductoFromPedido(pedidoId, productoId);
            const updatedProductos = pedido.pedidoProductos.filter(p => p.producto.id !== productoId);
            setPedido(prevPedido => ({ ...prevPedido, pedidoProductos: updatedProductos }));
            alert('Producto eliminado correctamente del pedido');
        } catch (error) {
            alert('Error al eliminar el producto del pedido');
            console.error('Error al eliminar el producto del pedido:', error);
        }
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando pedido...
            </Container>
        );
    }

    if (error || !pedido) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error || 'Pedido no encontrado.'}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="form-container">
            <Row className="my-4">
                <Col md={4}>
                    <Image
                        src={defaultInventario}
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
                        itemId={pedido.id}
                        itemName={`Pedido #${pedido.id}`}
                        onEdit={handleEdit}
                        onExport={handleExport}
                    />
                </Col>
                <Col md={8}>
                    <Card className={`custom-card ${openDetalles ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Características generales</h5>
                            <Button
                                onClick={toggleDetalles}
                                aria-controls="detalles-pedido"
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
                            <div id="detalles-pedido">
                                <Card.Body>
                                    <PedidoDetalles pedido={pedido} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

                    <Card className={`custom-card ${openProductos ? 'card-active' : ''} mt-4`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Productos</h5>
                            <Button
                                onClick={toggleProductos}
                                aria-controls="productos-pedido"
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
                            <div id="productos-pedido">
                                <Card.Body>
                                    <PedidoProducto
                                        productos={pedido.pedidoProductos}
                                        onInfo={handleInfo}
                                        onDelete={handleDelete}
                                    />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>
                </Col>
            </Row>

            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={pedidoFields}
                defaultValues={pedido}
                onSubmit={handleFormSubmit}
                title="EDITAR PEDIDO"
            />
        </Container>
    );
};

export default Pedido;
