import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../../css/Buttons.css'; // Asegúrate de que este archivo contenga los estilos necesarios

const ProductoBotones = ({ onEdit, onExport }) => (
    <div className="d-flex justify-content-center">
        {/* Botón para Editar */}
        <Button className=" button recover-button btn-edit" onClick={onEdit}>
            Editar
        </Button>

        {/* Botón para Exportar */}
        <Button className="button recover-button btn-success" onClick={onExport}>
            Exportar
        </Button>
    </div>
);

ProductoBotones.propTypes = {
    onEdit: PropTypes.func.isRequired,   // Función que se ejecuta al hacer clic en Editar
    onExport: PropTypes.func.isRequired, // Función que se ejecuta al hacer clic en Exportar
};

export default ProductoBotones;
