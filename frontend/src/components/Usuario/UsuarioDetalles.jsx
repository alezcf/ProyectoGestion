import React from 'react';
import PropTypes from 'prop-types';
import '../../css/DetallesEstandar.css';  // Asegúrate de importar el CSS aquí

const UsuarioDetalles = ({ usuario }) => {
    return (
        <div>
            <h3 className="detalles-marca">
                {usuario.nombreCompleto || "No existe registro"} {/* Nombre completo del usuario */}
            </h3>
            <p className="detalles-nombre">
                RUT: {usuario.rut || "No existe registro"} {/* RUT del usuario */}
            </p>
            <p className="detalles-info">
                <strong>Email:</strong> {usuario.email || "No existe registro"} {/* Email del usuario */}
            </p>
            <p className="detalles-info">
                <strong>Rol:</strong> {usuario.rol || "No existe registro"} {/* Rol del usuario */}
            </p>
            <p className="detalles-info">
                <strong>Creado el:</strong> {new Date(usuario.createdAt).toLocaleString() || "No existe registro"} {/* Fecha de creación */}
            </p>
            <p className="detalles-info">
                <strong>Última actualización:</strong> {new Date(usuario.updatedAt).toLocaleString() || "No existe registro"} {/* Fecha de última actualización */}
            </p>
        </div>
    );
};

UsuarioDetalles.propTypes = {
    usuario: PropTypes.shape({
        nombreCompleto: PropTypes.string.isRequired,
        rut: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        rol: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default UsuarioDetalles;
