import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';
import '../../css/DetallesEstandar.css';  // Asegúrate de importar el CSS aquí

const UsuarioDetalles = ({ usuario }) => {
    return (
        <Card className="detalles-card">
            <Card.Header className="detalles-card-header">
                <h2>Información del Usuario</h2>
            </Card.Header>
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
                    <strong>Registro de Cuenta: </strong>{new Date(usuario.createdAt).toLocaleString() || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Última Actualización: </strong>{new Date(usuario.updatedAt).toLocaleString() || "No existe registro"}
                </ListGroup.Item>
            </ListGroup>
        </Card>
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
