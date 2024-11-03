import React from 'react';
import { Link } from 'react-router-dom';
import { FileEarmarkExcel, InfoCircle } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import '../../css/Buttons.css';

const ButtonsActions = ({ itemId, itemData, onExport, detailsRoute }) => (
    <div className="d-flex justify-content-center">
        <Link to={`${detailsRoute}/${itemId}`} className="button btn-info me-2">
            <InfoCircle />
        </Link>
        <button
            type="button"
            className="button btn-success"
            onClick={() => onExport(itemData)}  // Pasar el objeto completo (usuario o proveedor)
        >
            <FileEarmarkExcel />
        </button>
    </div>
);

ButtonsActions.propTypes = {
    itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    itemData: PropTypes.object.isRequired,  // Cambiado a objeto genérico para usuarios o proveedores
    onExport: PropTypes.func.isRequired,
    detailsRoute: PropTypes.string.isRequired,
};

export default ButtonsActions;
