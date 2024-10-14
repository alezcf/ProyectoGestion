// src/components/Inventario/InventarioAcciones.js
import React from 'react';
import PropTypes from 'prop-types';
import ButtonsActions from '../Common/ButtonsActionsTable';

const InventarioAcciones = ({ inventarioId, inventarioNombre, onExport }) => (
    <ButtonsActions
        itemId={inventarioId}
        itemName={inventarioNombre}
        onExport={onExport}
        detailsRoute="/inventario"
    />
);

InventarioAcciones.propTypes = {
    inventarioId: PropTypes.number.isRequired,
    inventarioNombre: PropTypes.string.isRequired,
    onExport: PropTypes.func.isRequired,
};

export default InventarioAcciones;
