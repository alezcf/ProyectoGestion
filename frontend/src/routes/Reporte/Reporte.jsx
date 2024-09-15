// src/pages/Reporte/Reporte.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { fetchAllReportes, eliminarReporte } from '../../logic/reporte.logic';
import ReportCard from '../../components/Reporte/ReportCard';

const Reporte = () => {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllReportes(setReportes, setError);
    }, []);

    const handleEliminarNotificacion = (reporteId) => {
        eliminarReporte(reporteId, setReportes, setError, reportes);
    };

    if (error) {
        return <Alert variant="danger" className="text-center">Error: {error}</Alert>;
    }

    return (
        <Container fluid className="reportes-container">
        <Row>
            {reportes.length > 0 ? (
            reportes.map((reporte, index) => (
                <Col md={6} lg={4} key={index}>
                <ReportCard reporte={reporte} onDelete={handleEliminarNotificacion} />
                </Col>
            ))
            ) : (
            <p>Loading...</p>
            )}
        </Row>
        </Container>
    );
};

export default Reporte;
