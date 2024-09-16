import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productoService from '../../services/producto.service';
import { Container, Row, Col, Spinner, Alert, Form, Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form'; // Importamos react-hook-form
import ProductoImagen from '../../components/Producto/ProductoImagen';
import ProductoDetalles from '../../components/Producto/ProductoDetalles';
import ProductoCaracteristicas from '../../components/Producto/ProductoCaracteristicas';
import ProductoBotones from '../../components/Common/ButtonsActions';
import productoFields from '../../fields/producto.fields'; // Importamos los campos de validación

const Producto = () => {
    const { productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Configuración de useForm para manejar el formulario de edición
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const data = await productoService.getProducto(productoId);
                setProducto(data);
                reset(data); // Resetea el formulario con los datos del producto
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el producto.');
                setLoading(false);
            }
        };

        fetchProducto();
    }, [productoId, reset]);

    const handleEdit = () => {
        setShowEditModal(true); // Muestra el modal de edición
    };

    const handleExport = () => {
        console.log("Exportar los datos del producto");
        // Implementar lógica de exportación aquí
    };

    const handleFormSubmit = (data) => {
        console.log('Datos actualizados:', data);
        setShowEditModal(false);  // Cierra el modal al enviar
        // Implementar lógica para guardar los datos editados del producto
    };

    const handleCloseModal = () => {
        setShowEditModal(false);  // Cierra el modal sin guardar
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando producto...
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
        <Container>
            <Row className="my-4">
                <Col md={4}>
                    <ProductoImagen imagenRuta={producto?.imagen_ruta} />
                    <ProductoBotones onEdit={handleEdit} onExport={handleExport} />
                </Col>
                <Col md={8}>
                    <ProductoDetalles producto={producto} />
                    <ProductoCaracteristicas producto={producto} />
                </Col>
            </Row>

            {/* Modal para editar los datos del producto */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(handleFormSubmit)}>
                        {productoFields.map((field, index) => (
                            <Form.Group controlId={field.name} key={index}>
                                <Form.Label>{field.label}</Form.Label>
                                <Form.Control
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.name, field.validation)}  // Registra el campo con validaciones
                                />
                                {errors[field.name] && (
                                    <Alert variant="danger">{errors[field.name].message}</Alert>  // Muestra errores de validación
                                )}
                            </Form.Group>
                        ))}

                        <Button variant="primary" type="submit">
                            Guardar cambios
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Producto;
