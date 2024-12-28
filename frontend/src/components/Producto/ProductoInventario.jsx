import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import productoInventarioService from '../../services/productoInventario.service';
import inventarioService from '../../services/inventario.service';
import SecondaryTable from '../Common/SecondaryTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWarehouse, faEdit, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import { Form, Modal, Button, Alert } from 'react-bootstrap';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic';
import '../../css/Buttons.css';

const ProductoInventario = ({ producto = { id: null, productoInventarios: [] } }) => {
    const navigate = useNavigate();
    const { id: productoId } = producto;

    const [inventarios, setInventarios] = useState([]);
    const [nuevoInventarioId, setNuevoInventarioId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [allInventarios, setAllInventarios] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [selectedRelacion, setSelectedRelacion] = useState(null);
    const [newCantidad, setNewCantidad] = useState('');

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
                    console.log("Inventarios extraidos: ", inventariosExtraidos);
                }

                console.log('Inventarios del producto:', inventariosData);
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
                await productoInventarioService.createProductoInventarios(
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
            alert(error.response.data.message);
        }
    };

    const handleEditClick = (relacion) => {
        setSelectedRelacion(relacion);
        setNewCantidad(relacion.cantidad);
        setEditModal(true);
    };

    const handleUpdateCantidad = async () => {
        if (!selectedRelacion || newCantidad === '') {
            alert('Debe ingresar una nueva cantidad.');
            return;
        }

        try {
            const response = await productoInventarioService.updateCantidadProductoInventario(
                selectedRelacion.idRelacion,
                parseInt(newCantidad)
            );

            const inventariosActualizados = await productoInventarioService.getInventariosByProducto(productoId);

            if (inventariosActualizados) {
                const inventariosExtraidos = inventariosActualizados.map(relacion => ({
                    idRelacion: relacion.id,
                    inventario: relacion.inventario,
                    cantidad: relacion.cantidad
                }));
                setInventarios(inventariosExtraidos);
                setEditModal(false);
                alert(response.message || 'Cantidad actualizada correctamente');
            }
        } catch (error) {
            alert(error.data.message);
            console.error('Error al actualizar la cantidad:', error);
        }
    };

    // Renderiza cada fila de la tabla en SecondaryTable
    const renderRow = ({ idRelacion, inventario, cantidad }, index) => (
        <tr key={index}>
            <td>{inventario.nombre}</td>
            <td>{cantidad}</td>
            <td>{inventario.maximo_stock}</td>
            <td>{inventario.ultima_actualizacion ? formatDateToDDMMYYYY(inventario.ultima_actualizacion) : 'No hay registro'}</td>
            <td>
                <button type="button" className="button btn-info" onClick={() => handleInfo(inventario.id)}>
                    <InfoCircle />
                </button>
                <button type="button" className="button btn-edit" onClick={() => handleEditClick({ idRelacion, inventario, cantidad })}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button type="button" className="button btn-delete" onClick={() => handleDelete(idRelacion)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    );

    return (
        <div className="mt-2">
            {inventarios.length === 0 ? (
            <div className="my-3">
                <Alert variant="warning" className="text-center">
                    <FontAwesomeIcon icon={faAddressBook} />
                    <strong> No existen inventarios asociados a este producto.</strong>
                </Alert>
            </div>
        ) : (
            <SecondaryTable
                headers={['NOMBRE', 'CANTIDAD', 'MÁXIMO STOCK', 'ÚLTIMA ACTUALIZACIÓN', 'ACCIONES']}
                data={inventarios}
                renderRow={renderRow}
            />
            )}
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
                    <Button variant="primary" onClick={handleUpdateCantidad}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
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
                    ultima_actualizacion: PropTypes.string,
                }).isRequired,
                cantidad: PropTypes.number.isRequired,
            })
        ),
    }),
};

export default ProductoInventario;
