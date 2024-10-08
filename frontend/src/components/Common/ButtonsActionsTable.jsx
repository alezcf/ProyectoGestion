import React from 'react';
import { Link } from 'react-router-dom';
import { FileEarmarkExcel, InfoCircle } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import '../../css/Buttons.css';

const ButtonsActions = ({ itemId, itemName, onExport, detailsRoute }) => (
    <div className="d-flex justify-content-center">
        <Link to={`${detailsRoute}/${itemId}`} className="button btn-info me-2">
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
    itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,  // ID del item
    itemName: PropTypes.string.isRequired,  // Nombre del item
    onExport: PropTypes.func.isRequired,  // Función de exportación
    detailsRoute: PropTypes.string.isRequired,  // Ruta base para el link de detalles
};

export default ButtonsActions;
