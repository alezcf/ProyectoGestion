import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFileExcel, faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import '../../css/Buttons.css';

const ProductoBotones = ({ onEdit, onExport, onDelete, isDeleteMode, isDisabled, usuario }) => (
    <div className="d-flex justify-content-center mt-3 mb-3">
        {/* Botón para Editar */}
        <Button className="button recover-button btn-edit" onClick={onEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
            <span className="button-text"> Editar</span>
        </Button>

        {/* Botón para Exportar */}
        <Button className="button recover-button btn-success" onClick={onExport}>
            <FontAwesomeIcon icon={faFileExcel} />
            <span className="button-text"> Exportar</span>
        </Button>

        {/* Botón para Eliminar o Activar/Desactivar */}
        <Button
            className={`button recover-button ${isDeleteMode ? 'btn-delete' : 'signup-button'}`}
            onClick={onDelete}
            disabled={isDisabled}
        >
            <FontAwesomeIcon icon={isDeleteMode ? faTrash : faBan} />
            <span className="button-text">
                {isDeleteMode ? ' Eliminar' : usuario.isActive ? ' Desactivar' : ' Activar'}
            </span>
        </Button>
    </div>
);

ProductoBotones.propTypes = {
    onEdit: PropTypes.func.isRequired,       // Función que se ejecuta al hacer clic en Editar
    onExport: PropTypes.func.isRequired,     // Función que se ejecuta al hacer clic en Exportar
    onDelete: PropTypes.func.isRequired,     // Función que se ejecuta al hacer clic en Eliminar o Desactivar
    isDeleteMode: PropTypes.bool,            // Define si el botón está en modo Eliminar o Desactivar
    isDeleteDisabled: PropTypes.bool,        // Define si el botón debe estar deshabilitado
    isDisabled: PropTypes.bool,              // Define si el botón debe estar deshabilitado
    usuario: PropTypes.object.isRequired,    // Datos del usuario para determinar si está activo o inactivo
};

ProductoBotones.defaultProps = {
    isDeleteDisabled: false,  // Por defecto, el botón está habilitado
    isDisabled: false,        // Por defecto, el botón está habilitado
    isDeleteMode: true,       // Por defecto, el botón está en modo Eliminar
};

export default ProductoBotones;
