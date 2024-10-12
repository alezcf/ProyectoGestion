import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import productoProveedorService from '../../services/productoProveedor.service';  // Servicio para gestionar proveedores de producto
import proveedorService from '../../services/proveedor.service';  // Servicio para obtener todos los proveedores
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import '../../css/Buttons.css';

const ProductoProveedor = ({ producto = { id: null, productoProveedores: [] } }) => {
    const navigate = useNavigate();
    const { id: productoId } = producto;
    const [proveedores, setProveedores] = useState([]); // Lista de proveedores asociados al producto
    const [nuevoProveedorId, setNuevoProveedorId] = useState(''); // Para seleccionar un nuevo proveedor
    const [allProveedores, setAllProveedores] = useState([]); // Lista de todos los proveedores disponibles para agregar

    // Efecto para obtener los proveedores asociados al producto
    useEffect(() => {
        const fetchProveedoresProducto = async () => {
            try {
                const proveedoresData = await productoProveedorService.getProveedoresByProducto(productoId);
                if (proveedoresData) {
                    const proveedoresExtraidos = proveedoresData.map(relacion => ({
                        idRelacion: relacion.id,  // Guardamos el id de la relación
                        proveedor: relacion.proveedor
                    }));
                    setProveedores(proveedoresExtraidos); // Actualizamos los proveedores
                }
            } catch (error) {
                console.error('Error al obtener los proveedores del producto:', error);
            }
        };

        if (productoId) {
            fetchProveedoresProducto(); // Solo ejecutar si hay un ID de producto
        }
    }, [productoId]);

    // Efecto para obtener todos los proveedores
    useEffect(() => {
        const fetchAllProveedores = async () => {
            try {
                const response = await proveedorService.getAllProveedores(); // Llamada al servicio para obtener todos los proveedores
                if (response) {
                    setAllProveedores(response); // Almacenar todos los proveedores
                }
            } catch (error) {
                console.error('Error al obtener la lista de proveedores:', error);
            }
        };

        fetchAllProveedores(); // Ejecutar al cargar el componente
    }, []);

    // Función para eliminar una relación producto-proveedor por el id de la relación
    const handleDelete = async (relacionId) => {
        try {
            await productoProveedorService.deleteProductoProveedores(relacionId);
            // Actualizar la lista de proveedores después de eliminar
            const updatedProveedores = proveedores.filter(p => p.idRelacion !== relacionId);
            setProveedores(updatedProveedores);
            alert('Proveedor eliminado correctamente');
        } catch (error) {
            alert('Error al eliminar el proveedor');
            console.error('Error al eliminar el proveedor:', error);
        }
    };

    // Navegar a la página de detalles del proveedor
    const handleInfo = (proveedorId) => {
        navigate(`/proveedor/${proveedorId}`);
    };

    // Función para agregar un nuevo proveedor al producto
    const handleAddProveedor = async () => {
        if (!nuevoProveedorId) return;
        try {
            await productoProveedorService.createProductoProveedores(productoId, [parseInt(nuevoProveedorId)]);
            // Volver a obtener los proveedores actualizados automáticamente después de agregar el nuevo proveedor
            const proveedoresActualizados = await productoProveedorService.getProveedoresByProducto(productoId);
            if (proveedoresActualizados) {
                const proveedoresExtraidos = proveedoresActualizados.map(relacion => ({
                    idRelacion: relacion.id,
                    proveedor: relacion.proveedor
                }));
                setProveedores(proveedoresExtraidos); // Actualizar el estado de los proveedores con los nuevos datos
                setNuevoProveedorId(''); // Limpiar el selector
                alert('Proveedor agregado correctamente');
            }
        } catch (error) {
            alert('Error al agregar el proveedor');
            console.error('Error al agregar el proveedor:', error);
        }
    };

    return (
        <div className="mt-2">
            <Table striped bordered hover responsive className="text-center">
                <thead>
                    <tr>
                        <th>NOMBRE</th>
                        <th>CONTACTO</th>
                        <th>TELÉFONO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.length > 0 ? (
                        proveedores.map(({ idRelacion, proveedor }) => (
                            <tr key={proveedor.id}>
                                <td>{proveedor.nombre}</td>
                                <td>{proveedor.rut}</td>
                                <td>{proveedor.telefono}</td>
                                <td>
                                    <button type="button" className="button btn-info" onClick={() => handleInfo(proveedor.id)}>
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
                            <td colSpan="4" className="text-center">No hay proveedores disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Formulario para seleccionar y agregar un nuevo proveedor */}
            <Form className="d-flex align-items-center mt-3">
                <Form.Control
                    as="select"
                    value={nuevoProveedorId}
                    onChange={(e) => setNuevoProveedorId(e.target.value)}
                >
                    <option value="">Seleccione un nuevo proveedor</option>
                    {allProveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombre}
                        </option>
                    ))}
                </Form.Control>
                <button type="button" className="button btn-create ml-2" onClick={handleAddProveedor}>
                    <FontAwesomeIcon icon={faAddressBook} />
                </button>
            </Form>
        </div>
    );
};

// Ajuste en la validación de propTypes para aceptar productoProveedores vacío
ProductoProveedor.propTypes = {
    producto: PropTypes.shape({
        id: PropTypes.number.isRequired,
        productoProveedores: PropTypes.arrayOf(
            PropTypes.shape({
                proveedor: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    nombre: PropTypes.string.isRequired,
                    rut: PropTypes.string.isRequired,
                    direccion: PropTypes.string.isRequired,
                    telefono: PropTypes.string.isRequired,
                    email: PropTypes.string.isRequired,
                }).isRequired,
            })
        ),
    }),
};

export default ProductoProveedor;
