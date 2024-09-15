import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';
import '../../css/PerfilInfo.css';

const PerfilInfo = ({ perfilData }) => {
    return (
        <Card className="perfil-card">
            <Card.Header className="perfil-card-header">
                <h2>Perfil del Usuario</h2>
            </Card.Header>
            <ListGroup variant="flush">
                <ListGroup.Item className="perfil-list-group-item">
                    <strong>Nombre Completo: </strong>{perfilData.nombreCompleto}
                </ListGroup.Item>
                <ListGroup.Item className="perfil-list-group-item">
                    <strong>RUT: </strong>{perfilData.rut}
                </ListGroup.Item>
                <ListGroup.Item className="perfil-list-group-item">
                    <strong>Email: </strong>{perfilData.email}
                </ListGroup.Item>
                <ListGroup.Item className="perfil-list-group-item">
                    <strong>Rol: </strong>{perfilData.rol}
                </ListGroup.Item>
                <ListGroup.Item className="perfil-list-group-item">
                    <strong>Registro de Cuenta: </strong>{perfilData.createdAt}
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

PerfilInfo.propTypes = {
    perfilData: PropTypes.shape({
        nombreCompleto: PropTypes.string.isRequired,
        rut: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        rol: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default PerfilInfo;
