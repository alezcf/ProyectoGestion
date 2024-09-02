import React from 'react';
import PropTypes from 'prop-types';
import { Col, Image, Button } from 'react-bootstrap';

const ProductoImagen = ({ imageUrl, producto, BASE_URL }) => {
    return (
        <Col md={4} className="text-center">
            <Image
                className="detalle-producto-imagen"
                src={`${BASE_URL}${imageUrl}`}
                alt={producto.nombre}
                fluid
            />
            <Button variant="primary" className="editar-producto-boton">Editar Producto</Button>
        </Col>
    );
};

ProductoImagen.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    producto: PropTypes.object.isRequired,
    BASE_URL: PropTypes.string.isRequired
};


export default ProductoImagen;
