// src/components/Producto/ProductoImagen.js
import React from 'react';
import { Image } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductoImagen = ({ imagenRuta }) => {
    return (
        <Image
            src={imagenRuta ? `${BASE_URL}${imagenRuta}` : '../images/NoExiste.png'}
            fluid
            style={{
                objectFit: 'cover',
                width: '100%',
                maxHeight: '500px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
        />
    );
};

ProductoImagen.propTypes = {
    imagenRuta: PropTypes.string,
};

export default ProductoImagen;
