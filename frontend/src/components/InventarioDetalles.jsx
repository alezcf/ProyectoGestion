import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import '../css/Inventario.css';

const InventarioDetalles = ({ selectedData }) => {
    return (
        <div className="table-responsive">
            <Table striped bordered hover responsive="md" className="inventario-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Marca</th>
                        <th>Cantidad</th>
                        <th>Unidad de Medida</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedData.productoInventarios.map((productoInventario, index) => (
                        <tr key={index}>
                            <td>{productoInventario.producto.nombre}</td>
                            <td>{productoInventario.producto.descripcion}</td>
                            <td>{productoInventario.producto.marca}</td>
                            <td>{productoInventario.cantidad}</td>
                            <td>{productoInventario.producto.unidad_medida}</td>
                            <td>{productoInventario.producto.precio}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

InventarioDetalles.propTypes = {
    selectedData: PropTypes.shape({
        productoInventarios: PropTypes.array.isRequired,
        nombre: PropTypes.string.isRequired,
        maximo_stock: PropTypes.number.isRequired,
    }).isRequired,
};

export default InventarioDetalles;
