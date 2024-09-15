// src/components/Producto/ProductoDetalles.js
import React from 'react';
import PropTypes from 'prop-types';

const ProductoDetalles = ({ producto }) => (
    <div>
        <h3 style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '24px' }}>
            {producto.marca}
        </h3>
        <p style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>
            {producto.nombre}
        </p>
        <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '20px' }}>
            <strong>Código:</strong> {producto.codigo} &nbsp; | &nbsp;
            <strong>Categoría:</strong> {producto.categoria}
        </p>
        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
            <strong>Precio:</strong> ${producto.precio}
        </h3>
    </div>
);

ProductoDetalles.propTypes = {
    producto: PropTypes.shape({
        marca: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        codigo: PropTypes.string.isRequired,
        categoria: PropTypes.string.isRequired,
        precio: PropTypes.string.isRequired,
    }).isRequired,
};

export default ProductoDetalles;
