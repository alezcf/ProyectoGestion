import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import productoInventarioService from '../../services/productoInventario.service'; // Servicio para gestionar inventarios de producto
import inventarioService from '../../services/inventario.service'; // Servicio para obtener todos los inventarios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import '../../css/Buttons.css';

const ProductoInventario = ({ producto = { id: null, productoInventarios: [] } }) => {
    const navigate = useNavigate();
    const { id: productoId } = producto;
    const [inventarios, setInventarios] = useState([]); // Lista de inventarios asociados al producto
    const [nuevoInventarioId, setNuevoInventarioId] = useState(''); // Para seleccionar un nuevo inventario
    const [cantidad, setCantidad] = useState(''); // Para ingresar la cantidad del inventario
    const [allInventarios, setAllInventarios] = useState([]); // Lista de todos los inventarios disponibles para agregar

    // Efecto para obtener los inventarios asociados al producto
    useEffect(() => {
        const fetchInventariosProducto = async () => {
            try {
                const inventariosData = await productoInventarioService.getInventariosByProducto(productoId);
                if (inventariosData) {
                    const inventariosExtraidos = inventariosData.map(relacion => ({
                        idRelacion: relacion.id, // Guardamos el id de la relación
                        inventario: relacion.inventario,
                        cantidad: relacion.cantidad
                    }));
                    setInventarios(inventariosExtraidos); // Actualizamos los inventarios
                }
            } catch (error) {
                console.error('Error al obtener los inventarios del producto:', error);
            }
        };

        if (productoId) {
            fetchInventariosProducto(); // Solo ejecutar si hay un ID de producto
        }
    }, [productoId]);

    // Efecto para obtener todos los inventarios
    useEffect(() => {
        const fetchAllInventarios = async () => {
            try {
                const response = await inventarioService.getAllInventarios(); // Llamada al servicio para obtener todos los inventarios
                if (response) {
                    setAllInventarios(response); // Almacenar todos los inventarios
                }
            } catch (error) {
                console.error('Error al obtener la lista de inventarios:', error);
            }
        };

        fetchAllInventarios(); // Ejecutar al cargar el componente
    }, []);

    // Función para eliminar una relación producto-inventario por el id de la relación
    const handleDelete = async (relacionId) => {
        try {
            await productoInventarioService.deleteProductoInventarios(relacionId);
            // Actualizar la lista de inventarios después de eliminar
            const updatedInventarios = inventarios.filter(i => i.idRelacion !== relacionId);
            setInventarios(updatedInventarios);
            alert('Inventario eliminado correctamente');
        } catch (error) {
            alert('Error al eliminar el inventario');
            console.error('Error al eliminar el inventario:', error);
        }
    };

    // Navegar a la página de detalles del inventario
    const handleInfo = (inventarioId) => {
        navigate(`/inventario/${inventarioId}`);
    };

    // Función para agregar un nuevo inventario al producto usando createProductoInventarios
    const handleAddInventario = async () => {
        if (!nuevoInventarioId || !cantidad) {
            alert('Debe seleccionar un inventario y especificar una cantidad.');
            return;
        }

        try {
            // Llamar al método de creación con el productoId, inventariosIds y cantidades
            const response = await productoInventarioService.createProductoInventarios(
                productoId,
                [parseInt(nuevoInventarioId)], // Convertir el ID a número y pasarlo en un array
                [parseInt(cantidad)] // Convertir la cantidad a número y pasarlo en un array
            );
            console.log(response);
            // Si la respuesta fue exitosa, actualizar los inventarios
            const inventariosActualizados = await productoInventarioService.getInventariosByProducto(productoId);

            if (inventariosActualizados) {
                const inventariosExtraidos = inventariosActualizados.map(relacion => ({
                    idRelacion: relacion.id,
                    inventario: relacion.inventario,
                    cantidad: relacion.cantidad
                }));
                setInventarios(inventariosExtraidos); // Actualizar el estado de los inventarios con los nuevos datos
                setNuevoInventarioId(''); // Limpiar el selector
                setCantidad(''); // Limpiar la cantidad
                if(response.message){
                    alert(response.message);
                }
                else{
                    alert('Inventario agregado correctamente');
                }
            }
        } catch (error) {
            alert('Error al agregar el inventario');
            console.error('Error al agregar el inventario:', error);
        }
    };

    return (
        <div className="mt-2">
            <Table striped bordered hover responsive className="text-center">
                <thead>
                    <tr>
                        <th>NOMBRE</th>
                        <th>CANTIDAD</th>
                        <th>MÁXIMO STOCK</th>
                        <th>ÚLTIMA ACTUALIZACIÓN</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {inventarios.length > 0 ? (
                        inventarios.map(({ idRelacion, inventario, cantidad }) => (
                            <tr key={inventario.id}>
                                <td>{inventario.nombre}</td>
                                <td>{cantidad}</td>
                                <td>{inventario.maximo_stock}</td>
                                <td>{new Date(inventario.ultima_actualizacion).toLocaleString()}</td>
                                <td>
                                    <button type="button" className="button btn-info" onClick={() => handleInfo(inventario.id)}>
                                        <InfoCircle />
                                    </button>
                                    <button type="button" className="button btn-delete" onClick={() => handleDelete(idRelacion)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No hay inventarios disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Formulario para seleccionar y agregar un nuevo inventario con cantidad */}
            <Form className="d-flex align-items-center mt-3">
                <Form.Control
                    as="select"
                    value={nuevoInventarioId}
                    onChange={(e) => setNuevoInventarioId(e.target.value)}
                >
                    <option value="">Seleccione un nuevo inventario</option>
                    {allInventarios.map((inventario) => (
                        <option key={inventario.id} value={inventario.id}>
                            {inventario.nombre}
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
                <button type="button" className="button btn-create ml-2" onClick={handleAddInventario}>
                    <FontAwesomeIcon icon={faWarehouse} />
                </button>
            </Form>
        </div>
    );
};

// Ajuste en la validación de propTypes para aceptar productoInventarios vacío
ProductoInventario.propTypes = {
    producto: PropTypes.shape({
        id: PropTypes.number.isRequired,
        productoInventarios: PropTypes.arrayOf(
            PropTypes.shape({
                inventario: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    nombre: PropTypes.string.isRequired,
                    maximo_stock: PropTypes.number.isRequired,
                    ultima_actualizacion: PropTypes.string.isRequired,
                }).isRequired,
                cantidad: PropTypes.number.isRequired,
            })
        ),
    }),
};

export default ProductoInventario;
