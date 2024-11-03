import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pedidoService from '../../services/pedido.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import { Container, Row, Col, Spinner, Alert, Table, Button, Collapse, Card, Image } from 'react-bootstrap';
import PedidoDetalles from '../../components/Pedido/PedidoDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';
import DefaultEditModal from '../../components/Common/DefaultEditModal';  // Modal reutilizable
import pedidoFields from '../../fields/pedido.fields'; // Importa los campos de pedido
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../../css/Form.css';
import '../../css/Producto.css';

const Pedido = () => {
    const { pedidoId } = useParams();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openProductos, setOpenProductos] = useState(true);
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
        setShowEditModal(true); // Muestra el modal de edición
    };

    const handleExport = async () => {
        try {

            // Mapea los productos asociados al pedido
            const productosExport = pedido.pedidoProductos.map(productoPedido => ({
                "NOMBRE DEL PRODUCTO": productoPedido.producto.nombre,
                CANTIDAD: productoPedido.cantidad,
                PRECIO: productoPedido.precio,
                SUBTOTAL: productoPedido.cantidad * productoPedido.precio
            }));

            // Calcula el total de todos los productos
            const totalCost = productosExport.reduce((acc, producto) => acc + producto.SUBTOTAL, 0);

            const pedidoData = {
                "NÚMERO": pedido.id,
                'FECHA DEL PEDIDO': pedido.estado,
                'ESTADO ACTUAL': pedido.fecha_pedido,
                'TOTAL DEL PEDIDO': `$${totalCost}`,
            };
            // Nombres personalizados para las hojas de Excel
            const sheetNames = {
                mainSheet: "Pedido",        // Nombre de la hoja principal (datos del pedido)
                arraySheet1: "Productos"    // Nombre de la hoja para los productos
            };

            // Llamar al servicio de exportación para generar el archivo Excel con nombres de hoja personalizados
            await exportService.exportObjectAndArraysToExcel(pedidoData, [productosExport], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del pedido:', error);
            alert('Error al exportar los datos.');
        }
    };

    const handleFormSubmit = async (data) => {
        const pedidoActualizado = { ...pedido, ...data };

        try {
            console.log('Pedido actualizado:', pedidoActualizado);
            await pedidoService.updatePedido(pedidoId, pedidoActualizado);
            setPedido(pedidoActualizado);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false); // Cierra el modal sin guardar
    };

    const toggleProductos = () => {
        setOpenProductos(!openProductos);
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
                        src={defaultInventario} // Usa imagen predefinida si no tiene imagen
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
                    <PedidoDetalles pedido={pedido} />
                    {/* Collapse para productos del pedido */}
                    <Card className={`custom-card ${openProductos ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Productos en el Pedido</h5>
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
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Nombre del Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.pedidoProductos.map((productoPedido, index) => (
                                                <tr key={index}>
                                                    <td>{productoPedido.producto.nombre}</td>
                                                    <td>{productoPedido.cantidad}</td>
                                                    <td>${productoPedido.precio}</td>
                                                    <td>${productoPedido.cantidad * productoPedido.precio}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>
                </Col>
            </Row>

            {/* Modal para editar el pedido usando DefaultEditModal */}
            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={pedidoFields}  // Campos para el formulario de pedido
                defaultValues={pedido}  // Valores predeterminados del pedido actual
                onSubmit={handleFormSubmit}  // Enviar el formulario
                title="EDITAR PEDIDO"
            />
        </Container>
    );
};

export default Pedido;
