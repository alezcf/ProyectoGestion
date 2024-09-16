import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';
import '../../css/DetallesEstandar.css';  // Importamos el CSS estandarizado

const ProveedorDetalles = ({ proveedor }) => {
    return (
        <Card className="detalles-card">
            <Card.Header className="detalles-card-header">
                <h2>Información del Proveedor</h2>
            </Card.Header>
            <ListGroup variant="flush">
                <ListGroup.Item className="detalles-info">
                    <strong>Nombre:</strong> {proveedor.nombre || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>RUT:</strong> {proveedor.rut || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Dirección:</strong> {proveedor.direccion || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Teléfono:</strong> {proveedor.telefono || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Email:</strong> {proveedor.email || "No existe registro"}
                </ListGroup.Item>
            </ListGroup>
        </Card>
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
