import React from 'react';
import PropTypes from 'prop-types';
import '../../css/DetallesEstandar.css';  // Asegúrate de importar el CSS aquí

const ProductoDetalles = ({ producto }) => (
    <div>
        <p className="detalles-nombre">
            {producto.nombre || "No existe registro"} {/* Nombre del producto o mensaje si no existe */}
        </p>
    </div>
);

ProductoDetalles.propTypes = {
    producto: PropTypes.shape({

        nombre: PropTypes.string,
    }).isRequired,
};

export default ProductoDetalles;
