import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert } from 'react-bootstrap';
import { getAllUsuarios } from '../services/usuario.service';
import UsuariosDetalles from '../components/UsuarioDetalles';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await getAllUsuarios();
                setUsuarios(data);
            } catch (error) {
                setError('Error al cargar usuarios');
            }
        };

        fetchUsuarios();
    }, []);

    return (
        <Container fluid className="usuarios-container">
            <Row className="justify-content-md-center">
                <Card className="usuarios-card">
                    <Card.Header as="h1" className="usuarios-header">Usuarios</Card.Header>
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger" className="text-center">
                                {error}
                            </Alert>
                        ) : (
                            <>
                                {usuarios && (
                                    <UsuariosDetalles
                                        usuarios={usuarios}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                    />
                                )}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Usuarios;
