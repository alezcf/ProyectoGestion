import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import inventarioService from '../../services/inventario.service'; // Servicio para obtener el inventario por ID
import productoInventarioService from '../../services/productoInventario.service'; // Servicio para gestionar inventarios de producto
import productoService from '../../services/producto.service'; // Servicio para obtener todos los productos
import CustomTable from '../Common/CustomTable'; // Componente de tabla con paginación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import { Form } from 'react-bootstrap';
import '../../css/Buttons.css';
import '../../css/Inventario.css';

const InventarioProducto = () => {
    const { inventarioId } = useParams(); // Extraemos el inventarioId de la URL
    const [productos, setProductos] = useState([]); // Lista de productos del inventario
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Manejo de errores
    const [nuevoProductoId, setNuevoProductoId] = useState(''); // Para seleccionar un nuevo producto
    const [cantidad, setCantidad] = useState(''); // Para ingresar la cantidad del producto
    const [allProductos, setAllProductos] = useState([]); // Lista de todos los productos disponibles para agregar
    const navigate = useNavigate(); // Hook para redirigir a otras rutas

    // Efecto para obtener los productos asociados al inventario por ID
    useEffect(() => {
        const fetchInventario = async () => {
            try {
                const data = await inventarioService.getInventarioById(inventarioId); // Llamada al servicio usando el ID de la URL
                const { productoInventarios } = data; // Extraer productos del inventario

                const productosExtraidos = productoInventarios.map(({ id, producto, cantidad }) => ({
                    id: producto.id,
                    nombre: producto.nombre,
                    marca: producto.marca,
                    cantidad, // Cantidad de la relación
                    relacionId: id // Guardar la relación para eliminarla posteriormente
                }));

                setProductos(productosExtraidos); // Actualizamos los productos
                setLoading(false);
            } catch (error) {
                setError('Error al cargar los productos del inventario.');
                setLoading(false);
            }
        };

        fetchInventario(); // Ejecutar la función para obtener el inventario
    }, [inventarioId]);

    // Efecto para obtener todos los productos disponibles
    useEffect(() => {
        const fetchAllProductos = async () => {
            try {
                const response = await productoService.getAllProductos(); // Llamada al servicio para obtener todos los productos
                if (response) {
                    setAllProductos(response); // Almacenar todos los productos
                }
            } catch (error) {
                console.error('Error al obtener la lista de productos:', error);
            }
        };

        fetchAllProductos(); // Ejecutar al cargar el componente
    }, []);

    // Función para manejar la acción de eliminar un producto (basado en la relación)
    const handleDelete = async (relacionId) => {
        try {
            await productoInventarioService.deleteProductoInventarios(relacionId);
            // Actualizar la lista de productos después de eliminar
            const updatedProductos = productos.filter((producto) => producto.relacionId !== relacionId);
            setProductos(updatedProductos);
            alert('Producto eliminado correctamente');
        } catch (error) {
            alert('Error al eliminar el producto');
            console.error('Error al eliminar el producto:', error);
        }
    };

    // Función para manejar la acción de ver detalles de un producto
    const handleViewDetails = (productoId) => {
        // Redireccionar a la página de detalles del producto
        navigate(`/producto/${productoId}`);
    };

    // Función para agregar un nuevo producto al inventario usando createProductoInventarios
    const handleAddProducto = async () => {
        if (!nuevoProductoId || !cantidad) {
            alert('Debe seleccionar un producto y especificar una cantidad.');
            return;
        }

        try {
            // Llamar al método de creación con el inventarioId, productoId y cantidad
            const response = await productoInventarioService.createProductoInventarios(
                parseInt(nuevoProductoId),
                [parseInt(inventarioId)], // Inventario ID en un array
                [parseInt(cantidad)] // Convertir la cantidad a número y pasarlo en un array
            );
            console.log(response);
            // Si la respuesta fue exitosa, actualizar los productos
            const updatedInventario = await inventarioService.getInventarioById(inventarioId);
            const productosActualizados = updatedInventario.productoInventarios.map(({ id, producto, cantidad }) => ({
                id: producto.id,
                nombre: producto.nombre,
                marca: producto.marca,
                cantidad,
                relacionId: id
            }));
            setProductos(productosActualizados); // Actualizar el estado de los productos con los nuevos datos
            setNuevoProductoId(''); // Limpiar el selector
            setCantidad(''); // Limpiar la cantidad
            if (response.message) {
                alert(response.message);
            } else {
                alert('Producto agregado correctamente');
            }
        } catch (error) {
            alert('Error al agregar el producto');
            console.error('Error al agregar el producto:', error);
        }
    };

    // Función para renderizar una fila de productos en la tabla
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

            <CustomTable
                headers={['NOMBRE', 'MARCA', 'CANTIDAD', 'ACCIONES']}
                data={productos}
                renderRow={renderRow}
            />

            {/* Formulario para seleccionar y agregar un nuevo producto con cantidad */}
            <Form className="d-flex align-items-center mt-3">
                <Form.Control
                    as="select"
                    value={nuevoProductoId}
                    onChange={(e) => setNuevoProductoId(e.target.value)}
                >
                    <option value="">Seleccione un nuevo producto</option>
                    {allProductos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                            Nombre: {producto.nombre} -
                            Marca: {producto.marca}
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