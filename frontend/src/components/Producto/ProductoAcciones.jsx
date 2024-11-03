// src/components/Producto/ProductoAcciones.js
import React from 'react';
import PropTypes from 'prop-types';
import ButtonsActionsTable from '../Common/ButtonsActionsTable';

const ProductoAcciones = ({ productoId, producto, onExport }) => (
    <ButtonsActionsTable
        itemId={productoId}
        itemData={producto} // Pasar el objeto producto completo
        onExport={() => onExport(producto)} // Llamar a onExport con el producto completo
        detailsRoute="/producto"
    />
);

ProductoAcciones.propTypes = {
    productoId: PropTypes.number.isRequired,
    producto: PropTypes.object.isRequired, // Cambiar productoNombre a producto completo
    onExport: PropTypes.func.isRequired,
};

export default ProductoAcciones;
