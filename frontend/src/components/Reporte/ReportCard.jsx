// src/components/Common/ReportCard.js
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ReportCard = ({ reporte, onDelete }) => (
    <Card className="mb-4 reporte-card text-center">
        <Card.Body className="d-flex flex-column align-items-center">
        <Card.Title className="reporte-card-title">{reporte.titulo}</Card.Title>
        <Card.Text className="flex-grow-1">{reporte.descripcion}</Card.Text>
        <Card.Text><strong>Importancia:</strong> {reporte.importancia}</Card.Text>
        <Card.Text><strong>Fecha:</strong> {new Date(reporte.fecha).toLocaleDateString()}</Card.Text>
        <Card.Text><strong>Hora:</strong> {new Date(reporte.fecha).toLocaleTimeString()}</Card.Text>
        <Card.Text><strong>Producto Asignado:</strong> {reporte.productoAsignado.nombre}</Card.Text>
        <Link to={`/producto/${reporte.productoAsignado._id}`} className="btn btn-info mt-auto">Ver producto</Link>
        <Button variant="danger" onClick={() => onDelete(reporte._id)}>Eliminar reporte</Button>
        </Card.Body>
    </Card>
);

ReportCard.propTypes = {
    reporte: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ReportCard;
