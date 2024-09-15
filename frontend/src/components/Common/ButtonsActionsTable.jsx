// src/components/Common/ButtonsActions.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FileEarmarkExcel, InfoCircle } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import '../../css/Buttons.css';

const ButtonsActions = ({ itemId, itemName, onExport }) => (
    <div className="d-flex justify-content-center">
        <Link to={`/producto/${itemId}`} className="button btn-info me-2">
            <InfoCircle />
        </Link>
        <button
            type="button"
            className="button btn-success"
            onClick={() => onExport(itemName)}
        >
            <FileEarmarkExcel />
        </button>
    </div>
);

ButtonsActions.propTypes = {
    itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,  // ID del item (puede ser producto o inventario)
    itemName: PropTypes.string.isRequired,  // Nombre del item
    onExport: PropTypes.func.isRequired,  // Función de exportación
};

export default ButtonsActions;
