import React from 'react';
import PropTypes from 'prop-types';
import '../../css/DetallesEstandar.css';  // Importamos el CSS estandarizado

const ProveedorDetalles = ({ proveedor }) => {
    return (
        <div>
            <h3 className="detalles-marca">
                {proveedor.nombre || "No existe registro"} {/* Nombre del proveedor o mensaje si no existe */}
            </h3>
            <p className="detalles-nombre">
                RUT: {proveedor.rut || "No existe registro"} {/* Subtítulo que contiene el RUT o mensaje si no existe */}
            </p>
            <p className="detalles-info">
                <strong>Dirección:</strong> {proveedor.direccion || "No existe registro"} {/* Dirección o mensaje si no existe */}
            </p>
            <p className="detalles-info">
                <strong>Teléfono:</strong> {proveedor.telefono || "No existe registro"} {/* Teléfono o mensaje si no existe */}
            </p>
            <p className="detalles-info">
                <strong>Email:</strong> {proveedor.email || "No existe registro"} {/* Email o mensaje si no existe */}
            </p>
        </div>
    );
};

ProveedorDetalles.propTypes = {
    proveedor: PropTypes.shape({
        nombre: PropTypes.string,
        rut: PropTypes.string,
        direccion: PropTypes.string,
        telefono: PropTypes.string,
        email: PropTypes.string,
    }).isRequired,
};

export default ProveedorDetalles;
