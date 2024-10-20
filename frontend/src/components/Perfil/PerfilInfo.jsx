import React from 'react';
import PropTypes from 'prop-types';
import { Container, ListGroup } from 'react-bootstrap';
import '../../css/DetallesEstandar.css';  // Asegúrate de importar el CSS aquí

const PerfilInfo = ({ perfilData }) => {
    return (
        <Container>
            <ListGroup variant="flush">
                <ListGroup.Item className="detalles-info">
                    <strong>Nombre Completo: </strong>{perfilData.nombreCompleto || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>RUT: </strong>{perfilData.rut || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Email: </strong>{perfilData.email || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Rol: </strong>{perfilData.rol || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Registro de Cuenta: </strong>{new Date(perfilData.createdAt).toLocaleString() || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Última Actualización: </strong>{new Date(perfilData.updatedAt).toLocaleString() || "No existe registro"}
                </ListGroup.Item>
            </ListGroup>
        </Container>
    );
};

PerfilInfo.propTypes = {
    perfilData: PropTypes.shape({
        nombreCompleto: PropTypes.string.isRequired,
        rut: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        rol: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default PerfilInfo;
