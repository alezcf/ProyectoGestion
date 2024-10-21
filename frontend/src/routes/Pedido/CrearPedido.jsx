import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCartShopping, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import pedidoService from '../../services/pedido.service';
import productoService from '../../services/producto.service';
import proveedorService from '../../services/proveedor.service';
import inventarioService from '../../services/inventario.service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY } from '../../logic/dateFormat.logic'; // Importar funciones
import '../../css/Form.css';

const CrearPedido = () => {
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]);
    const [inventariosDisponibles, setInventariosDisponibles] = useState([]);
    const [page, setPage] = useState(0); // Controla la página actual del formulario
    const [fechaPedido, setFechaPedido] = useState(null); // Manejar la fecha seleccionada

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            productos: [{ productoId: '', cantidad: '' }]
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

    const onSubmit = async (data) => {
        if (page < 1) {
            setPage(page + 1);
        } else {
            try {
                // Convertir la fecha a yyyy-mm-dd antes de enviar los datos
                const formattedData = {
                    ...data,
                    fecha_pedido: formatDateToYYYYMMDD(fechaPedido),
                };
                console.log(formattedData);
                await pedidoService.createPedido(formattedData);
                alert('Pedido creado exitosamente');
                reset();
                setPage(0);
            } catch (err) {
                alert(err.response.data.message);
            }
        }
    };

    const renderPageFields = () => {
        if (page === 0) {
            return (
                <>
                    <Row>
                        {/* Selección de proveedor */}
                        <Col md={6}>
                            <Form.Group controlId="proveedor_id">
                                <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>PROVEEDOR (*)</Form.Label>
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

                        {/* Selección de inventario */}
                        <Col md={6}>
                            <Form.Group controlId="inventario_asignado_id">
                                <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>INVENTARIO (*)</Form.Label>
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
                        {/* Selección de la fecha del pedido */}
                        <Col md={6}>
                            <Form.Group controlId="fecha_pedido">
                                <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>FECHA DEL PEDIDO (*)</Form.Label>
                                <DatePicker
                                    selected={fechaPedido}
                                    onChange={(date) => setFechaPedido(date)} // Manejamos el cambio de fecha aquí
                                    dateFormat="dd/MM/yyyy" // Mostrar como dd/mm/yyyy
                                    placeholderText="Selecciona la fecha"
                                    className={`form-input ${errors.fecha_pedido ? 'is-invalid' : ''}`}
                                />
                                {errors.fecha_pedido && <span className="text-danger">{errors.fecha_pedido.message}</span>}
                            </Form.Group>
                        </Col>

                        {/* Selección del estado */}
                        <Col md={6}>
                            <Form.Group controlId="estado">
                                <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>ESTADO ACTUAL (*)</Form.Label>
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
                            {/* Selección de producto */}
                            <Col md={6}>
                                <Form.Group controlId={`producto_${index}`}>
                                    <Form.Label className="form-label" style={{ fontWeight: 'bold' }}>PRODUCTO (*)</Form.Label>
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

                            {/* Cantidad de producto */}
                            <Col md={6}>
                                <Form.Group controlId={`cantidad_${index}`}>
                                    <Form.Label style={{ fontWeight: 'bold' }} className="form-label" >CANTIDAD (*)</Form.Label>
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

                            <Col md={12} className="text-right">
                                <Button variant="danger" onClick={() => remove(index)}>
                                    Eliminar Producto
                                </Button>
                            </Col>
                        </Row>
                    ))}

                    <Button variant="secondary" onClick={() => append({ productoId: '', cantidad: '' })}>
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
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {renderPageFields()}

                        <div className="button-container mt-4">
                            {page > 0 && (
                                <button
                                    className="button-previous"
                                    type="button"
                                    onClick={() => setPage(page - 1)}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} /> ATRÁS
                                </button>
                            )}

                            {page < 1 ? (
                                <button
                                    className="button-next"
                                    type="button"
                                    onClick={() => setPage(page + 1)}
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
                </Col>
            </Row>
        </Container>
    );
};

export default CrearPedido;
