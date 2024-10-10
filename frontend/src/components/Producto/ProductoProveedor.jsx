import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import productoService from '../../services/producto.service';
import { getAllProveedores } from '../../services/proveedor.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import '../../css/Buttons.css';

const ProductoProveedor = ({ producto }) => {
    const navigate = useNavigate();
    const { id: productoId, productoProveedores } = producto;
    const [proveedores, setProveedores] = useState(productoProveedores.map(proveedorRelacion => proveedorRelacion.proveedor));
    const [nuevoProveedorId, setNuevoProveedorId] = useState('');
    const [allProveedores, setAllProveedores] = useState([]);

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const proveedoresData = await getAllProveedores();
                setAllProveedores(proveedoresData);
            } catch (error) {
                console.error('Error al obtener los proveedores:', error);
            }
        };
        fetchProveedores();
    }, []);

    const handleDelete = async (updatedProveedores) => {
        try {
            // Actualizar el producto con la nueva lista de proveedores
            await productoService.updateProducto({
                id: productoId,
                proveedores: updatedProveedores.map(proveedor => proveedor.id),
            });
            setProveedores(updatedProveedores);
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
        }
    };

    const handleInfo = (proveedorId) => {
        navigate(`/proveedor/${proveedorId}`);
    };

    const handleAddProveedor = async () => {
        if (!nuevoProveedorId) return;
        try {
            // Crear una nueva lista de proveedores con el proveedor agregado
            const updatedProveedores = [...proveedores, { id: parseInt(nuevoProveedorId) }];
            await productoService.updateProducto({
                id: productoId,
                proveedores: updatedProveedores.map(proveedor => proveedor.id),
            });
            setProveedores(updatedProveedores);
            setNuevoProveedorId('');
        } catch (error) {
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
                        proveedores.map(proveedor => (
                            <tr key={proveedor.id}>
                                <td>{proveedor.nombre}</td>
                                <td>{proveedor.rut}</td>
                                <td>{proveedor.telefono}</td>
                                <td>
                                    <button type="button" className="button btn-info" onClick={() => handleInfo(proveedor.id)}>
                                        <InfoCircle />
                                    </button>
                                    <button type="button" className="button btn-delete" onClick={() => {
                                            const updatedProveedores = proveedores.filter(p => p.id !== proveedor.id);
                                            handleDelete(updatedProveedores);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No hay proveedores disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Form className="d-flex align-items-center">
                <Form.Control
                    as="select"
                    value={nuevoProveedorId}
                    onChange={(e) => setNuevoProveedorId(e.target.value)}
                >
                    <option value="">Seleccione un nuevo proveedor</option>
                    {allProveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                    ))}
                </Form.Control>
                <button type="button" className="button btn-create" onClick={handleAddProveedor}>
                    <FontAwesomeIcon icon={faAddressBook}/>
                </button>
            </Form>
        </div>
    );
};

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
        ).isRequired,
    }).isRequired
};

export default ProductoProveedor;