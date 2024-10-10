import React from 'react';
import { Table, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductoInventario = ({ inventarios }) => (
    <div className="mt-4">
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Nombre de Inventario</th>
                    <th>Cantidad</th>
                    <th>Máximo Stock</th>
                    <th>Última Actualización</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {inventarios.length > 0 ? (
                    inventarios.map(inventario => (
                        <tr key={inventario.id}>
                            <td>{inventario.inventario.nombre}</td>
                            <td>{inventario.cantidad}</td>
                            <td>{inventario.inventario.maximo_stock}</td>
                            <td>{new Date(inventario.inventario.ultima_actualizacion).toLocaleString()}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => onEdit(inventario.id)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => onDelete(inventario.id)}
                                >
                                    Eliminar
                                </Button>
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
    </div>
);

ProductoInventario.propTypes = {
    inventarios: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            cantidad: PropTypes.number.isRequired,
            inventario: PropTypes.shape({
                id: PropTypes.number.isRequired,
                nombre: PropTypes.string.isRequired,
                maximo_stock: PropTypes.number.isRequired,
                ultima_actualizacion: PropTypes.string.isRequired,
            }).isRequired,
        })
    ).isRequired
};

export default ProductoInventario;