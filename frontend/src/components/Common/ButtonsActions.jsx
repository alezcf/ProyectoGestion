import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFileExcel, faTrash } from '@fortawesome/free-solid-svg-icons'; // Asegúrate de importar el icono correcto
import '../../css/Buttons.css'; // Asegúrate de que este archivo contenga los estilos necesarios

const ProductoBotones = ({ onEdit, onExport, onDelete, isDeleteDisabled }) => (
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

        {/* Botón para Eliminar */}
        <Button
            className="button recover-button btn-delete"
            onClick={onDelete}
            disabled={isDeleteDisabled} // Aquí se controla si el botón está habilitado o no
        >
            <FontAwesomeIcon icon={faTrash} />
            <span className="button-text"> Eliminar</span>
        </Button>
    </div>
);

ProductoBotones.propTypes = {
    onEdit: PropTypes.func.isRequired,   // Función que se ejecuta al hacer clic en Editar
    onExport: PropTypes.func.isRequired, // Función que se ejecuta al hacer clic en Exportar
    onDelete: PropTypes.func.isRequired, // Función que se ejecuta al hacer clic en Eliminar
    isDeleteDisabled: PropTypes.bool,    // Define si el botón de Eliminar está habilitado o no
};

ProductoBotones.defaultProps = {
    isDeleteDisabled: false, // Por defecto, el botón de Eliminar está habilitado
};

export default ProductoBotones;
