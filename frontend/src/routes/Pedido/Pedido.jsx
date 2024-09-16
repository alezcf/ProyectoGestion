import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pedidoService from '../../services/pedido.service';
import { Container, Row, Col, Spinner, Alert, Table, Button, Modal } from 'react-bootstrap';
import PedidoDetalles from '../../components/Pedido/PedidoDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';

const Pedido = () => {
    const { pedidoId } = useParams();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

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
        <Container>
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
            </Row>

            {/* Tabla para mostrar los productos del pedido */}
            <Row className="my-4">
                <Col>
                    <h4>Productos en el Pedido</h4>
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
