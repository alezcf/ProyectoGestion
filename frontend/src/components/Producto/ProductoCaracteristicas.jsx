import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductoCaracteristicas = ({ producto }) => (
    <div className="mt-4">
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
                    <td>{producto.descripcion || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td>Categoría</td>
                    <td>{producto.categoria || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td>Tipo</td>
                    <td>{producto.tipo || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td>Contenido</td>
                    <td>{producto.contenido ? `${producto.contenido}` : 'No hay registro'}</td>
                </tr>
                <tr>
                    <td>Unidad de medida</td>
                    <td>{producto.unidad_medida ? producto.unidad_medida.toUpperCase() : 'No hay registro'}</td>
                </tr>
                <tr>
                    <td>Código</td>
                    <td>{producto.codigo || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td>Precio</td>
                    <td>{producto.precio ? `$${producto.precio}` : 'No hay registro'}</td>
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
        contenido: PropTypes.string,
        unidad_medida: PropTypes.string,
        codigo: PropTypes.string,
        precio: PropTypes.string,
    }).isRequired,
};

export default ProductoCaracteristicas;
