import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pedidoService from '../../services/pedido.service';
import { Container, Row, Col, Spinner, Alert, Table, Button, Modal, Collapse, Card } from 'react-bootstrap';
import PedidoDetalles from '../../components/Pedido/PedidoDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';
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

    const handleExport = () => {
        console.log('Exportar los datos del pedido');
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
                        <center><h2>Información del Pedido</h2></center>
            <Row className="my-4">
                <Col md={4}>
                    {/* Mostrar los detalles del pedido */}
                    <PedidoDetalles pedido={pedido} />
                    <ButtonsActions
                        itemId={pedido.id}
                        itemName={`Pedido #${pedido.id}`}
                        onEdit={handleEdit}
                        onExport={handleExport}
                    />
                </Col>
                <Col md={8}>
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
                                                <th>Unidad de Medida</th>
                                                <th>Precio</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.pedidoProductos.map((productoPedido, index) => (
                                                <tr key={index}>
                                                    <td>{productoPedido.producto.nombre}</td>
                                                    <td>{productoPedido.cantidad}</td>
                                                    <td>{productoPedido.producto.unidad_medida}</td>
                                                    <td>${productoPedido.producto.precio}</td>
                                                    <td>${productoPedido.cantidad * productoPedido.producto.precio}</td>
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

            {/* Modal para editar los datos del pedido */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Aquí puedes incluir el formulario de edición del pedido.</p>
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

export default Pedido;
