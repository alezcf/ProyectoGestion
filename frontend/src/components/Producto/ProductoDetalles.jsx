import React from 'react';
import PropTypes from 'prop-types';
import '../../css/DetallesEstandar.css';  // Asegúrate de importar el CSS aquí

const ProductoDetalles = ({ producto }) => (
    <div>
        <h3 className="detalles-marca">
            {producto.marca || "No existe registro"} {/* Marca del producto o mensaje si no existe */}
        </h3>
        <p className="detalles-nombre">
            {producto.nombre || "No existe registro"} {/* Nombre del producto o mensaje si no existe */}
        </p>
        <p className="detalles-info">
            <strong>Código:</strong> {producto.codigo || "No existe registro"}
        </p>
        <h3 className="detalles-precio">
            <strong>Precio:</strong> ${producto.precio || "No existe registro"} {/* Precio del producto o mensaje si no existe */}
        </h3>
    </div>
);

ProductoDetalles.propTypes = {
    producto: PropTypes.shape({
        marca: PropTypes.string,
        nombre: PropTypes.string,
        codigo: PropTypes.string,
        categoria: PropTypes.string,
        precio: PropTypes.string,
    }).isRequired,
};

export default ProductoDetalles;
