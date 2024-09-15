// src/components/Producto/ProductoCaracteristicas.js
import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductoCaracteristicas = ({ producto }) => (
    <div className="mt-4">
        <h4 style={{ fontSize: '22px', marginBottom: '15px' }}>Características Generales</h4>
        <Table striped bordered hover responsive style={{ textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                    <th style={{ width: '40%' }}>Características</th>
                    <th>Detalle</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Descripción</td>
                    <td>{producto.descripcion || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Categoría</td>
                    <td>{producto.categoria || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Tipo</td>
                    <td>{producto.tipo || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Cantidad</td>
                    <td>{producto.cantidad ? `${producto.cantidad} ${producto.unidad_medida}` : 'N/A'}</td>
                </tr>
                <tr>
                    <td>Unidad de medida</td>
                    <td>{producto.unidad_medida ? producto.unidad_medida.toUpperCase() : 'N/A'}</td>
                </tr>
            </tbody>
        </Table>
    </div>
);

ProductoCaracteristicas.propTypes = {
    producto: PropTypes.shape({
        descripcion: PropTypes.string,
        categoria: PropTypes.string,
        tipo: PropTypes.string,
        cantidad: PropTypes.string,
        unidad_medida: PropTypes.string,
    }).isRequired,
};

export default ProductoCaracteristicas;
