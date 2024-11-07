// InventarioProducto.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import inventarioService from '../../services/inventario.service';
import productoInventarioService from '../../services/productoInventario.service';
import productoService from '../../services/producto.service';
import SecondaryTable from '../Common/SecondaryTable'; // Componente de tabla secundaria con paginación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import { Form } from 'react-bootstrap';
import '../../css/Buttons.css';
import '../../css/Inventario.css';

const InventarioProducto = () => {
    const { inventarioId } = useParams();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nuevoProductoId, setNuevoProductoId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [allProductos, setAllProductos] = useState([]);
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
        try {
            await productoInventarioService.deleteProductoInventarios(relacionId);
            const updatedProductos = productos.filter((producto) => producto.relacionId !== relacionId);
            setProductos(updatedProductos);
            alert('Producto eliminado correctamente');
        } catch (error) {
            alert('Error al eliminar el producto');
            console.error('Error al eliminar el producto:', error);
        }
    };

    const handleViewDetails = (productoId) => {
        navigate(`/producto/${productoId}`);
    };

    const handleAddProducto = async () => {
        if (!nuevoProductoId || !cantidad) {
            alert('Debe seleccionar un producto y especificar una cantidad.');
            return;
        }

        try {
            const response = await productoInventarioService.createProductoInventarios(
                parseInt(nuevoProductoId),
                [parseInt(inventarioId)],
                [parseInt(cantidad)]
            );
            console.log(response);

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
            alert(response.message || 'Producto agregado correctamente');
        } catch (error) {
            alert('Error al agregar el producto');
            console.error('Error al agregar el producto:', error);
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
                >
                    <InfoCircle />
                </button>
                <button
                    type="button"
                    className="button btn-delete"
                    onClick={() => handleDelete(producto.relacionId)}
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
            <SecondaryTable
                headers={['NOMBRE', 'MARCA', 'CANTIDAD', 'ACCIONES']}
                data={productos}
                renderRow={renderRow}
            />

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
                <button type="button" className="button btn-create ml-2" onClick={handleAddProducto}>
                    <FontAwesomeIcon icon={faWarehouse} />
                </button>
            </Form>
        </div>
    );
};

export default InventarioProducto;
