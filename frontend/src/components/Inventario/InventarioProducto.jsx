import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import inventarioService from '../../services/inventario.service';
import productoInventarioService from '../../services/productoInventario.service';
import productoService from '../../services/producto.service';
import SecondaryTable from '../Common/SecondaryTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWarehouse, faEdit, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import { Form, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import '../../css/Buttons.css';
import '../../css/Inventario.css';

const InventarioProducto = ({ onProductoChange }) => {
    const { inventarioId } = useParams();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nuevoProductoId, setNuevoProductoId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [allProductos, setAllProductos] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [selectedRelacion, setSelectedRelacion] = useState(null);
    const [newCantidad, setNewCantidad] = useState('');
    const [loadingAction, setLoadingAction] = useState(false); // Para acciones individuales
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventario = async () => {
            try {
                const data = await inventarioService.getInventarioById(inventarioId);
                const { productoInventarios } = data;

                const productosExtraidos = productoInventarios.map(({ id, producto, cantidad }) => ({
                    id: producto.id,
                    nombre: producto.nombre,
                    marca: producto.marca,
                    cantidad,
                    relacionId: id
                }));

                setProductos(productosExtraidos);
                setLoading(false);
            } catch (error) {
                setError('Error al cargar los productos del inventario.');
                setLoading(false);
            }
        };

        fetchInventario();
    }, [inventarioId]);

    useEffect(() => {
        const fetchAllProductos = async () => {
            try {
                const response = await productoService.getAllProductos();
                setAllProductos(response);
            } catch (error) {
                console.error('Error al obtener la lista de productos:', error);
            }
        };

        fetchAllProductos();
    }, []);

    const handleDelete = async (relacionId) => {
        if (loadingAction) return;

        setLoadingAction(true);
        try {
            await productoInventarioService.deleteProductoInventarios(relacionId);
            const updatedProductos = productos.filter((producto) => producto.relacionId !== relacionId);
            setProductos(updatedProductos);
            alert('Producto eliminado correctamente');

            if (onProductoChange) {
                onProductoChange(); // Notifica al componente padre
            }
        } catch (error) {
            alert('Error al eliminar el producto');
            console.error('Error al eliminar el producto:', error);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleViewDetails = (productoId) => {
        navigate(`/producto/${productoId}`);
    };

    const handleAddProducto = async () => {
        if (!nuevoProductoId || cantidad <= 0) {
            alert('Debe seleccionar un producto y especificar una cantidad válida.');
            return;
        }

        if (loadingAction) return;

        setLoadingAction(true);
        try {
            await productoInventarioService.createProductoInventarios(
                parseInt(nuevoProductoId),
                [parseInt(inventarioId)],
                [parseInt(cantidad)]
            );

            const updatedInventario = await inventarioService.getInventarioById(inventarioId);

            const productosActualizados = updatedInventario.productoInventarios.map(({ id, producto, cantidad }) => ({
                id: producto.id,
                nombre: producto.nombre,
                marca: producto.marca,
                cantidad,
                relacionId: id
            }));
            setProductos(productosActualizados);
            setNuevoProductoId('');
            setCantidad('');
            alert('Producto agregado correctamente');

            if (onProductoChange) {
                onProductoChange(); // Notifica al componente padre
            }
        } catch (error) {
            console.log('Error al agregar el producto: ' + error.response.data.message);
            alert(error.response.data.message);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleEditClick = (producto) => {
        setSelectedRelacion(producto);
        setNewCantidad(producto.cantidad);
        setEditModal(true);
    };

    const handleUpdateCantidad = async () => {
        if (!selectedRelacion || newCantidad <= 0) {
            alert('Debe ingresar una cantidad mayor a 0.');
            return;
        }

        if (loadingAction) return;

        setLoadingAction(true);
        try {
            await productoInventarioService.updateCantidadProductoInventario(
                selectedRelacion.relacionId,
                parseInt(newCantidad)
            );

            const updatedInventario = await inventarioService.getInventarioById(inventarioId);
            const productosActualizados = updatedInventario.productoInventarios.map(({ id, producto, cantidad }) => ({
                id: producto.id,
                nombre: producto.nombre,
                marca: producto.marca,
                cantidad,
                relacionId: id
            }));
            setProductos(productosActualizados);
            setEditModal(false);
            alert('Cantidad actualizada correctamente');

            if (onProductoChange) {
                onProductoChange(); // Notifica al componente padre
            }
        } catch (error) {
            alert('Error al actualizar la cantidad: ' + error.data.message);
        } finally {
            setLoadingAction(false);
        }
    };

    const renderRow = (producto, index) => (
        <tr key={index}>
            <td>{producto.nombre}</td>
            <td>{producto.marca}</td>
            <td>{producto.cantidad}</td>
            <td>
                <button
                    type="button"
                    className="button btn-info"
                    onClick={() => handleViewDetails(producto.id)}
                    disabled={loadingAction}
                >
                    <InfoCircle />
                </button>
                <button
                    type="button"
                    className="button btn-edit"
                    onClick={() => handleEditClick(producto)}
                    disabled={loadingAction}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                    type="button"
                    className="button btn-delete"
                    onClick={() => handleDelete(producto.relacionId)}
                    disabled={loadingAction}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    );

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="mt-2">
            {productos.length === 0 ? (
            <div className="my-3">
                <Alert variant="warning" className="text-center">
                    <FontAwesomeIcon icon={faAddressBook} />
                    <strong> No existen productos asociados a este inventario.</strong>
                </Alert>
            </div>
        ) : (
            <SecondaryTable
                headers={['NOMBRE', 'MARCA', 'CANTIDAD', 'ACCIONES']}
                data={productos}
                renderRow={renderRow}
            />
        )}

            <Form className="d-flex align-items-center mt-3">
                <Form.Control
                    as="select"
                    value={nuevoProductoId}
                    onChange={(e) => setNuevoProductoId(e.target.value)}
                >
                    <option value="">Seleccione un nuevo producto</option>
                    {allProductos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                            Nombre: {producto.nombre} - Marca: {producto.marca}
                        </option>
                    ))}
                </Form.Control>
                <Form.Control
                    type="number"
                    placeholder="Cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="ml-2"
                />
                <button
                    type="button"
                    className="button btn-create ml-2"
                    onClick={handleAddProducto}
                    disabled={loadingAction}
                >
                    {loadingAction ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faWarehouse} />}
                </button>
            </Form>

            <Modal show={editModal} onHide={() => setEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Cantidad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            type="number"
                            value={newCantidad}
                            onChange={(e) => setNewCantidad(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpdateCantidad} disabled={loadingAction}>
                        {loadingAction ? <Spinner animation="border" size="sm" /> : 'Guardar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InventarioProducto;
