import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import pedidoService from '../../services/pedido.service'; // Servicio para crear pedidos
import productoService from '../../services/producto.service'; // Servicio para obtener productos
import proveedorService from '../../services/proveedor.service'; // Servicio para obtener proveedores
import inventarioService from '../../services/inventario.service'; // Servicio para obtener inventarios

const CrearPedido = () => {
    const [productosDisponibles, setProductosDisponibles] = useState([]); // Estado para almacenar productos
    const [proveedoresDisponibles, setProveedoresDisponibles] = useState([]); // Estado para almacenar proveedores
    const [inventariosDisponibles, setInventariosDisponibles] = useState([]); // Estado para almacenar inventarios

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            productos: [{ productoId: '', cantidad: '' }] // Inicializamos un producto vacío en el array de productos
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'productos',
    });

    // Función para obtener todos los productos, proveedores e inventarios al cargar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await productoService.getAllProductos();
                setProductosDisponibles(response); // Guardamos los productos en el estado
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            }
        };

        const fetchProveedores = async () => {
            try {
                const response = await proveedorService.getAllProveedores();
                setProveedoresDisponibles(response); // Guardamos los proveedores en el estado
            } catch (error) {
                console.error('Error al cargar los proveedores:', error);
            }
        };

        const fetchInventarios = async () => {
            try {
                const response = await inventarioService.getAllInventarios();
                setInventariosDisponibles(response); // Guardamos los inventarios en el estado
            } catch (error) {
                console.error('Error al cargar los inventarios:', error);
            }
        };

        fetchProductos(); // Cargar productos
        fetchProveedores(); // Cargar proveedores
        fetchInventarios(); // Cargar inventarios
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log(data);
            await pedidoService.createPedido(data);
            alert('Pedido creado exitosamente');
            reset(); // Resetea el formulario después del envío
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2>Crear Pedido</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* Selección de proveedor */}
                        <Form.Group controlId="proveedor_id">
                            <Form.Label>Proveedor</Form.Label>
                            <Form.Control
                                as="select"
                                {...register('proveedor_id', {
                                    required: 'El proveedor es obligatorio',
                                })}
                            >
                                <option value="">Selecciona un proveedor</option>
                                {proveedoresDisponibles.map((proveedor) => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.nombre} - {proveedor.direccion}
                                    </option>
                                ))}
                            </Form.Control>
                            {errors.proveedor_id && (
                                <span className="text-danger">{errors.proveedor_id.message}</span>
                            )}
                        </Form.Group>

                        {/* Selección de inventario */}
                        <Form.Group controlId="inventario_asignado_id">
                            <Form.Label>Inventario Asignado</Form.Label>
                            <Form.Control
                                as="select"
                                {...register('inventario_asignado_id', {
                                    required: 'El inventario asignado es obligatorio',
                                })}
                            >
                                <option value="">Selecciona un inventario</option>
                                {inventariosDisponibles.map((inventario) => (
                                    <option key={inventario.id} value={inventario.id}>
                                        {inventario.nombre}
                                    </option>
                                ))}
                            </Form.Control>
                            {errors.inventario_asignado_id && (
                                <span className="text-danger">{errors.inventario_asignado_id.message}</span>
                            )}
                        </Form.Group>

                        {/* Selección de la fecha del pedido */}
                        <Form.Group controlId="fecha_pedido">
                            <Form.Label>Fecha de Pedido</Form.Label>
                            <Form.Control
                                type="date"
                                {...register('fecha_pedido', {
                                    required: 'La fecha del pedido es obligatoria',
                                })}
                            />
                            {errors.fecha_pedido && (
                                <span className="text-danger">{errors.fecha_pedido.message}</span>
                            )}
                        </Form.Group>

                        {/* Selección del estado */}
                        <Form.Group controlId="estado">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el estado del pedido"
                                {...register('estado', {
                                    required: 'El estado del pedido es obligatorio',
                                    minLength: {
                                        value: 3,
                                        message: 'El estado debe tener al menos 3 caracteres',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'El estado no debe exceder los 50 caracteres',
                                    }
                                })}
                            />
                            {errors.estado && (
                                <span className="text-danger">{errors.estado.message}</span>
                            )}
                        </Form.Group>

                        {/* Sección de productos */}
                        <h3>Productos</h3>
                        {fields.map((item, index) => (
                            <div key={item.id}>
                                <Form.Group controlId={`producto_${index}`}>
                                    <Form.Label>Producto</Form.Label>
                                    <Form.Control
                                        as="select"
                                        {...register(`productos[${index}].productoId`, {
                                            required: 'El producto es obligatorio',
                                        })}
                                    >
                                        <option value="">Selecciona un producto</option>
                                        {productosDisponibles.map((producto) => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.nombre} - {producto.marca}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    {errors.productos?.[index]?.productoId && (
                                        <span className="text-danger">
                                            {errors.productos[index].productoId.message}
                                        </span>
                                    )}
                                </Form.Group>

                                <Form.Group controlId={`cantidad_${index}`}>
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa la cantidad"
                                        {...register(`productos[${index}].cantidad`, {
                                            required: 'La cantidad es obligatoria',
                                            min: {
                                                value: 1,
                                                message: 'La cantidad debe ser al menos 1',
                                            }
                                        })}
                                    />
                                    {errors.productos?.[index]?.cantidad && (
                                        <span className="text-danger">
                                            {errors.productos[index].cantidad.message}
                                        </span>
                                    )}
                                </Form.Group>

                                <Button variant="danger" onClick={() => remove(index)}>
                                    Eliminar Producto
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="secondary"
                            onClick={() => append({ productoId: '', cantidad: '' })}
                        >
                            Añadir Producto
                        </Button>

                        <Button variant="primary" type="submit" className="mt-3">
                            Crear Pedido
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CrearPedido;
