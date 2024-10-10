import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productoService from '../../services/producto.service';
import { Container, Row, Col, Spinner, Alert, Button, Modal, Collapse, Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProductoImagen from '../../components/Producto/ProductoImagen';
import ProductoDetalles from '../../components/Producto/ProductoDetalles';
import ProductoCaracteristicas from '../../components/Producto/ProductoCaracteristicas';
import ProductoBotones from '../../components/Common/ButtonsActions';
import productoFields from '../../fields/producto.fields';
import ProductoProveedor from '../../components/Producto/ProductoProveedor';
import ProductoInventario from '../../components/Producto/ProductoInventario';
import '../../css/Form.css';
import '../../css/Producto.css';

const Producto = () => {
    const { productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true); // Inicialmente abierta la tabla de detalles
    const [openProveedores, setOpenProveedores] = useState(false); // Tabla de proveedores cerrada por defecto
    const [openInventarios, setOpenInventarios] = useState(false); // Tabla de inventarios cerrada por defecto

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const data = await productoService.getProducto(productoId);
                setProducto(data);
                reset(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el producto.');
                setLoading(false);
            }
        };

        fetchProducto();
    }, [productoId, reset]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleExport = () => {
        console.log("Exportar los datos del producto");
    };

    const handleFormSubmit = (data) => {
        console.log('Datos actualizados:', data);
        setShowEditModal(false);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const toggleDetalles = () => {
        setOpenDetalles(true);
        setOpenProveedores(false); // Cierra proveedores al abrir detalles
        setOpenInventarios(false); // Cierra inventarios al abrir detalles
    };

    const toggleProveedores = () => {
        setOpenProveedores(true);
        setOpenDetalles(false); // Cierra detalles al abrir proveedores
        setOpenInventarios(false); // Cierra inventarios al abrir proveedores
    };

    const toggleInventarios = () => {
        setOpenInventarios(true);
        setOpenDetalles(false); // Cierra detalles al abrir inventarios
        setOpenProveedores(false); // Cierra proveedores al abrir inventarios
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

    const proveedores = producto?.productoProveedores?.map(proveedorRelacion => {
        const { proveedor } = proveedorRelacion; // Extraemos el objeto proveedor directamente para simplificar
        return {
            id: proveedor.id,
            nombre: proveedor.nombre,
            rut: proveedor.rut,
            direccion: proveedor.direccion,
            telefono: proveedor.telefono,
            email: proveedor.email
        };
    }) || [];

    const inventarios = producto?.productoInventarios?.map(inventarioRelacion => {
        const { inventario } = inventarioRelacion; // Extraemos el objeto inventario directamente para simplificar
        return {
            id: inventarioRelacion.id,
            cantidad: inventarioRelacion.cantidad,
            inventario: {
                id: inventario.id,
                nombre: inventario.nombre,
                maximo_stock: inventario.maximo_stock,
                ultima_actualizacion: inventario.ultima_actualizacion
            }
        };
    }) || [];

    return (
        <Container fluid className="form-container">
            <Row className="my-4">
                <Col md={4}>
                <center><h1><ProductoDetalles producto={producto} /></h1></center>
                    <ProductoImagen imagenRuta={producto?.imagen_ruta} />
                    <ProductoBotones onEdit={handleEdit} onExport={handleExport} />
                </Col>
                <Col md={8}>

                    {/* Collapse para la tabla de detalles del producto */}
                    <Card className={`mb-3 custom-card ${openDetalles ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Características generales</h5>
                            <Button
                                onClick={toggleDetalles}
                                aria-controls="detalles-producto"
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
                            <div id="detalles-producto">
                                <Card.Body>
                                    <ProductoCaracteristicas producto={producto} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

                    {/* Collapse para la tabla de proveedores */}
                    <Card className={`custom-card ${openProveedores ? 'card-active' : ''} mt-4`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Proveedores</h5>
                            <Button
                                onClick={toggleProveedores}
                                aria-controls="proveedores-producto"
                                aria-expanded={openProveedores}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openProveedores ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Collapse in={openProveedores}>
                            <div id="proveedores-producto">
                                <Card.Body>
                                    <ProductoProveedor producto={producto} proveedores={proveedores} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

                    {/* Collapse para la tabla de inventarios */}
                    <Card className={`custom-card ${openInventarios ? 'card-active' : ''} mt-4`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Inventarios</h5>
                            <Button
                                onClick={toggleInventarios}
                                aria-controls="inventarios-producto"
                                aria-expanded={openInventarios}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openInventarios ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Collapse in={openInventarios}>
                            <div id="inventarios-producto">
                                <Card.Body>
                                    <ProductoInventario inventarios={inventarios} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

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
                                    <Alert variant="danger">{errors[field.name].message}</Alert>
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