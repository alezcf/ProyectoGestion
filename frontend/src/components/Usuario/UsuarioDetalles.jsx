import React from 'react';
import PropTypes from 'prop-types';
import { Container, ListGroup } from 'react-bootstrap';
import '../../css/DetallesEstandar.css';  // Asegúrate de importar el CSS aquí
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic'; // Importamos la función de formateo

const UsuarioDetalles = ({ usuario }) => {
    return (
        <Container>
            <ListGroup variant="flush">
                <ListGroup.Item className="detalles-info">
                    <strong>Nombre Completo: </strong>{usuario.nombreCompleto || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>RUT: </strong>{usuario.rut || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Email: </strong>{usuario.email || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Rol: </strong>{usuario.rol || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Estado: </strong>
                    {(() => {
                        if (usuario.isActive !== undefined) {
                            return usuario.isActive ? "Activo" : "Inactivo";
                        } else {
                            return "No existe registro";
                        }
                    })()}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Registro de Cuenta: </strong>{usuario.createdAt ? formatDateToDDMMYYYY(usuario.createdAt) : "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Última Actualización: </strong>{usuario.updatedAt ? formatDateToDDMMYYYY(usuario.updatedAt) : "No existe registro"}
                </ListGroup.Item>
            </ListGroup>
        </Container>
    );
};

UsuarioDetalles.propTypes = {
    usuario: PropTypes.shape({
        nombreCompleto: PropTypes.string.isRequired,
        rut: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        rol: PropTypes.string.isRequired,
        isActive: PropTypes.bool.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default UsuarioDetalles;
