import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import inventarioService from '../../services/inventario.service'; // Servicio para obtener el inventario por ID
import CustomTable from '../Common/CustomTable'; // Componente de tabla con paginación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import '../../css/Buttons.css';
import '../../css/Inventario.css';

const InventarioProducto = () => {
    const { inventarioId } = useParams(); // Extraemos el inventarioId de la URL
    const [productos, setProductos] = useState([]); // Lista de productos del inventario
    const [inventarioNombre, setInventarioNombre] = useState(''); // Nombre del inventario
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Manejo de errores
    const navigate = useNavigate(); // Hook para redirigir a otras rutas

    // Efecto para obtener los productos asociados al inventario por ID
    useEffect(() => {
        const fetchInventario = async () => {
            try {
                const data = await inventarioService.getInventarioById(inventarioId); // Llamada al servicio usando el ID de la URL
                const { productoInventarios, nombre } = data; // Extraer productos y nombre del inventario

                const productosExtraidos = productoInventarios.map(({ producto, cantidad }) => ({
                    id: producto.id,
                    nombre: producto.nombre,
                    marca: producto.marca,
                    cantidad, // Cantidad de la relación
                }));

                setInventarioNombre(nombre); // Actualizamos el nombre del inventario
                setProductos(productosExtraidos); // Actualizamos los productos
                setLoading(false);
            } catch (error) {
                setError('Error al cargar los productos del inventario.');
                setLoading(false);
            }
        };

        fetchInventario(); // Ejecutar la función para obtener el inventario
    }, [inventarioId]);

    // Función para manejar la acción de eliminar un producto (basado en la relación)
    const handleDelete = (productoId) => {
        alert(`Eliminar producto con ID: ${productoId}`);
    };

    // Función para manejar la acción de ver detalles de un producto
    const handleViewDetails = (productoId) => {
        // Redireccionar a la página de detalles del producto
        navigate(`/producto/${productoId}`);
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
                    onClick={() => handleDelete(producto.id)}
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
            <h2>Inventario: {inventarioNombre}</h2>

            <CustomTable
                headers={['NOMBRE', 'MARCA', 'CANTIDAD', 'ACCIONES']}
                data={productos}
                renderRow={renderRow}
            />
        </div>
    );
};

export default InventarioProducto;
