import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCartShopping, faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import pedidoService from '../../services/pedido.service';
import productoService from '../../services/producto.service';
import proveedorService from '../../services/proveedor.service';
import inventarioService from '../../services/inventario.service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateToYYYYMMDD } from '../../logic/dateFormat.logic';
import '../../css/Form.css';

const CrearPedido = () => {
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]);
    const [inventariosDisponibles, setInventariosDisponibles] = useState([]);
    const [page, setPage] = useState(0);
    const [fechaPedido, setFechaPedido] = useState(new Date());
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { register, handleSubmit, control, trigger, formState: { errors }, reset } = useForm({
        defaultValues: {
            productos: [{ productoId: '', cantidad: '', precio: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'productos',
    });

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await productoService.getAllProductos();
                setProductosDisponibles(response);
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            }
        };

        const fetchProveedores = async () => {
            try {
                const response = await proveedorService.getAllProveedores();
                setProveedoresDisponibles(response);
            } catch (error) {
                console.error('Error al cargar los proveedores:', error);
            }
        };

        const fetchInventarios = async () => {
            try {
                const response = await inventarioService.getAllInventarios();
                setInventariosDisponibles(response);
            } catch (error) {
                console.error('Error al cargar los inventarios:', error);
            }
        };

        fetchProductos();
        fetchProveedores();
        fetchInventarios();
    }, []);

    const confirmSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                fecha_pedido: formatDateToYYYYMMDD(fechaPedido),
            };
            await pedidoService.createPedido(formattedData);
            alert('Pedido creado exitosamente');
            reset();
            setPage(0);
            setShowConfirmation(false);
        } catch (err) {
            console.log('Error al crear el pedido:', err);
            alert(err.details || 'Error al crear el pedido.');
            setShowConfirmation(false);
        }
    };

    const handleNext = async () => {
        // Validar campos específicos
        const isValid = await trigger(['proveedor_id', 'inventario_asignado_id', 'estado']);
        if (!fechaPedido) {
            alert("La fecha del pedido es obligatoria.");
            return;
        }
        if (isValid) {
            setPage(page + 1); // Avanzar si todos los campos son válidos
        }
    };

    const renderTooltip = (message) => (
        <Tooltip style={{ maxWidth: '200px' }}>{message}</Tooltip>
    );

    const renderPageFields = () => {
        if (page === 0) {
            return (
                <>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="proveedor_id">
                                <OverlayTrigger
                                    placement="auto"
                                    flip
                                    overlay={renderTooltip("Selecciona el proveedor para este pedido. Campo obligatorio.")}
                                >
                                    <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>PROVEEDOR (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    as="select"
                                    {...register('proveedor_id', { required: 'El proveedor es obligatorio' })}
                                    className={`form-input ${errors.proveedor_id ? 'is-invalid' : ''}`}
                                >
                                    <option value="">Selecciona un proveedor</option>
                                    {proveedoresDisponibles.map((proveedor) => (
                                        <option key={proveedor.id} value={proveedor.id}>
                                            {proveedor.nombre} - {proveedor.direccion}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errors.proveedor_id && <span className="text-danger">{errors.proveedor_id.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="inventario_asignado_id">
                                <OverlayTrigger
                                    placement="auto"
                                    flip
                                    overlay={renderTooltip("Selecciona el inventario donde se asignará este pedido. Campo obligatorio.")}
                                >
                                    <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>INVENTARIO (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    as="select"
                                    {...register('inventario_asignado_id', { required: 'El inventario asignado es obligatorio' })}
                                    className={`form-input ${errors.inventario_asignado_id ? 'is-invalid' : ''}`}
                                >
                                    <option value="">Selecciona un inventario</option>
                                    {inventariosDisponibles.map((inventario) => (
                                        <option key={inventario.id} value={inventario.id}>
                                            {inventario.nombre}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errors.inventario_asignado_id && <span className="text-danger">{errors.inventario_asignado_id.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                        <Form.Group controlId="fecha_pedido">
                            <OverlayTrigger
                                placement="auto"
                                flip
                                overlay={renderTooltip("Selecciona la fecha para este pedido. Campo obligatorio.")}
                            >
                                <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>FECHA DEL PEDIDO (*)</Form.Label>
                            </OverlayTrigger>
                            <DatePicker
                                selected={fechaPedido}
                                onChange={(date) => setFechaPedido(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecciona la fecha"
                                className={`form-input ${!fechaPedido ? 'is-invalid' : ''}`}
                            />
                            {!fechaPedido && <span className="text-danger">La fecha del pedido es obligatoria</span>}
                        </Form.Group>

                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="estado">
                                <OverlayTrigger
                                    placement="auto"
                                    flip
                                    overlay={renderTooltip("Indica el estado actual del pedido: Completo, Pendiente o Cancelado.")}
                                >
                                    <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>ESTADO ACTUAL (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    as="select"
                                    {...register('estado', { required: 'El estado del pedido es obligatorio' })}
                                    className={`form-input ${errors.estado ? 'is-invalid' : ''}`}
                                >
                                    <option value="">Selecciona el estado</option>
                                    <option value="Completo">Completo</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Cancelado">Cancelado</option>
                                </Form.Control>
                                {errors.estado && <span className="text-danger">{errors.estado.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                </>
            );
        } else if (page === 1) {
            return (
                <>
                    {fields.map((item, index) => (
                        <Row key={item.id}>
                            <Col md={4}>
                                <Form.Group controlId={`producto_${index}`}>
                                    <OverlayTrigger
                                        placement="auto"
                                        flip
                                        overlay={renderTooltip("Selecciona el producto para agregar a este pedido. Campo obligatorio.")}
                                    >
                                        <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>PRODUCTO (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        as="select"
                                        {...register(`productos[${index}].productoId`, { required: 'El producto es obligatorio' })}
                                        className={`form-input ${errors.productos?.[index]?.productoId ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Selecciona un producto</option>
                                        {productosDisponibles.map((producto) => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.nombre} - {producto.marca}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    {errors.productos?.[index]?.productoId && (
                                        <span className="text-danger">{errors.productos[index].productoId.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId={`cantidad_${index}`}>
                                    <OverlayTrigger
                                        placement="auto"
                                        flip
                                        overlay={renderTooltip("Especifica la cantidad de este producto en el pedido. Debe ser un número positivo.")}
                                    >
                                        <Form.Label style={{ fontWeight: 'bold' }} className="form-label">CANTIDAD (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa la cantidad"
                                        {...register(`productos[${index}].cantidad`, {
                                            required: 'La cantidad es obligatoria',
                                            min: { value: 1, message: 'La cantidad debe ser al menos 1' },
                                        })}
                                        className={`form-input ${errors.productos?.[index]?.cantidad ? 'is-invalid' : ''}`}
                                    />
                                    {errors.productos?.[index]?.cantidad && (
                                        <span className="text-danger">{errors.productos[index].cantidad.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId={`precio_${index}`}>
                                    <OverlayTrigger
                                        placement="auto"
                                        flip
                                        overlay={renderTooltip("Especifica el precio de este producto. Debe ser un número positivo.")}
                                    >
                                        <Form.Label style={{ fontWeight: 'bold' }} className="form-label">PRECIO UNITARIO (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa el precio"
                                        {...register(`productos[${index}].precio`, {
                                            required: 'El precio es obligatorio',
                                            min: { value: 1, message: 'El precio debe ser positivo' },
                                            max: { value: 1000000, message: 'El precio no debe exceder los $1.000.000' },
                                        })}
                                        className={`form-input ${errors.productos?.[index]?.precio ? 'is-invalid' : ''}`}
                                    />
                                    {errors.productos?.[index]?.precio && (
                                        <span className="text-danger">{errors.productos[index].precio.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={12} className="text-right">
                                <center><Button className="button btn-delete" variant="danger" onClick={() => remove(index)}>
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                </Button>
                                </center>
                            </Col>
                        </Row>
                    ))}

                    <Button className="button" variant="secondary" onClick={() => append({ productoId: '', cantidad: '', precio: '' })}>
                        Añadir Producto
                    </Button>
                </>
            );
        }
    };

    return (
        <Container className="form-container">
            <Row className="justify-content-md-center mt-5">
                <Col md={8}>
                    <h2 className="text-center mb-4"><FontAwesomeIcon icon={faCartShopping} /> REGISTRAR PEDIDO</h2>
                    <Form onSubmit={handleSubmit(() => setShowConfirmation(true))}>
                        {renderPageFields()}

                        <div className="button-container mt-4 d-flex justify-content-between">
                            <button
                                className="button-previous"
                                type="button"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 0}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} /> ATRÁS
                            </button>

                            {page < 1 ? (
                                <button
                                    className="button-next"
                                    type="button"
                                    onClick={handleNext}
                                >
                                    SIGUIENTE <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            ) : (
                                <button className="button-submit" type="submit">
                                    <FontAwesomeIcon icon={faPaperPlane} /> REGISTRAR
                                </button>
                            )}
                        </div>
                    </Form>

                    {/* Modal de Confirmación */}
                    <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>¿Estás seguro de que deseas crear el pedido?</Modal.Body>
                        <Modal.Footer>
                            <button
                                className="button-previous"
                                onClick={() => setShowConfirmation(false)}
                            >
                                CANCELAR
                            </button>
                            <button
                                className="button-next"
                                onClick={handleSubmit(confirmSubmit)}
                            >
                                GUARDAR <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default CrearPedido;
