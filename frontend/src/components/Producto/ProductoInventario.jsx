import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import productoInventarioService from '../../services/productoInventario.service'; // Servicio para gestionar inventarios de producto
import inventarioService from '../../services/inventario.service'; // Servicio para obtener todos los inventarios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic';  // Importa la función de formato
import '../../css/Buttons.css';

const ProductoInventario = ({ producto = { id: null, productoInventarios: [] } }) => {
    const navigate = useNavigate();
    const { id: productoId } = producto;
    const [inventarios, setInventarios] = useState([]);
    const [nuevoInventarioId, setNuevoInventarioId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [allInventarios, setAllInventarios] = useState([]);

    // Efecto para obtener los inventarios asociados al producto
    useEffect(() => {
        const fetchInventariosProducto = async () => {
            try {
                const inventariosData = await productoInventarioService.getInventariosByProducto(productoId);
                if (inventariosData) {
                    const inventariosExtraidos = inventariosData.map(relacion => ({
                        idRelacion: relacion.id,
                        inventario: relacion.inventario,
                        cantidad: relacion.cantidad
                    }));
                    setInventarios(inventariosExtraidos);
                }
            } catch (error) {
                console.error('Error al obtener los inventarios del producto:', error);
            }
        };

        if (productoId) {
            fetchInventariosProducto();
        }
    }, [productoId]);

    useEffect(() => {
        const fetchAllInventarios = async () => {
            try {
                const response = await inventarioService.getAllInventarios();
                if (response) {
                    setAllInventarios(response);
                }
            } catch (error) {
                console.error('Error al obtener la lista de inventarios:', error);
            }
        };

        fetchAllInventarios();
    }, []);

    const handleDelete = async (relacionId) => {
        try {
            await productoInventarioService.deleteProductoInventarios(relacionId);
            const updatedInventarios = inventarios.filter(i => i.idRelacion !== relacionId);
            setInventarios(updatedInventarios);
            alert('Inventario eliminado correctamente');
        } catch (error) {
            alert('Error al eliminar el inventario');
            console.error('Error al eliminar el inventario:', error);
        }
    };

    const handleInfo = (inventarioId) => {
        navigate(`/inventario/${inventarioId}`);
    };

    const handleAddInventario = async () => {
        if (!nuevoInventarioId || !cantidad) {
            alert('Debe seleccionar un inventario y especificar una cantidad.');
            return;
        }

        try {
            const response = await productoInventarioService.createProductoInventarios(
                productoId,
                [parseInt(nuevoInventarioId)],
                [parseInt(cantidad)]
            );

            const inventariosActualizados = await productoInventarioService.getInventariosByProducto(productoId);

            if (inventariosActualizados) {
                const inventariosExtraidos = inventariosActualizados.map(relacion => ({
                    idRelacion: relacion.id,
                    inventario: relacion.inventario,
                    cantidad: relacion.cantidad
                }));
                setInventarios(inventariosExtraidos);
                setNuevoInventarioId('');
                setCantidad('');
                alert(response.message || 'Inventario agregado correctamente');
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
                                <td>{inventario.ultima_actualizacion ? formatDateToDDMMYYYY(inventario.ultima_actualizacion) : 'No hay registro'}</td>
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
