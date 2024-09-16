import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';
import '../../css/DetallesEstandar.css';  // Importamos el CSS estandarizado

const PedidoDetalles = ({ pedido }) => {
    return (
        <Card className="detalles-card">
            <Card.Header className="detalles-card-header">
                <h2>Información del Pedido</h2>
            </Card.Header>
            <ListGroup variant="flush">
                <ListGroup.Item className="detalles-info">
                    <strong>ID del Pedido:</strong> {pedido.id || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Fecha del Pedido:</strong> {new Date(pedido.fecha_pedido).toLocaleDateString() || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Estado:</strong> {pedido.estado || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Proveedor:</strong> {pedido.proveedor?.nombre || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>RUT Proveedor:</strong> {pedido.proveedor?.rut || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Inventario Asignado:</strong> {pedido.inventarioAsignado?.nombre || "No existe registro"}
                </ListGroup.Item>
                <ListGroup.Item className="detalles-info">
                    <strong>Última Actualización del Inventario:</strong> {new Date(pedido.inventarioAsignado?.ultima_actualizacion).toLocaleDateString() || "No existe registro"}
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

PedidoDetalles.propTypes = {
    pedido: PropTypes.shape({
        id: PropTypes.number,
        fecha_pedido: PropTypes.string,
        estado: PropTypes.string,
        proveedor: PropTypes.shape({
            nombre: PropTypes.string,
            rut: PropTypes.string,
        }),
        inventarioAsignado: PropTypes.shape({
            nombre: PropTypes.string,
            ultima_actualizacion: PropTypes.string,
        }),
    }).isRequired,
};

export default PedidoDetalles;
