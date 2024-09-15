// src/components/Producto/ProductoAcciones.js
import React from 'react';
import PropTypes from 'prop-types';
import ButtonsActions from '../Common/ButtonsActionsTable';

const ProductoAcciones = ({ productoId, productoNombre, onExport }) => (
    <ButtonsActions
        itemId={productoId}
        itemName={productoNombre}
        onExport={onExport}
    />
);

ProductoAcciones.propTypes = {
    productoId: PropTypes.number.isRequired,
    productoNombre: PropTypes.string.isRequired,
    onExport: PropTypes.func.isRequired,
};

export default ProductoAcciones;
