import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usuarioService from '../../services/usuario.service'; // Importa el servicio para obtener los datos del usuario
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import UsuarioDetalles from '../../components/Usuario/UsuarioDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions'; // Importamos el componente

const Usuario = () => {
    const { usuarioId } = useParams();
    const [usuario, setUsuario] = useState(null); // Inicializa el estado como null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await usuarioService.getUsuario(usuarioId); // Cambia a tu servicio de usuario

                if (response) {
                    setUsuario(response); // Asigna los datos solo si existen
                } else {
                    setError('Usuario no encontrado.');
                }
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos del usuario.');
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [usuarioId]);

    const handleEdit = () => {
        console.log("Editar los datos del usuario");
    };

    const handleExport = () => {
        console.log("Exportar los datos del usuario");
        // Implementar lógica de exportación aquí
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando usuario...
            </Container>
        );
    }

    if (error || !usuario) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error || 'Usuario no encontrado.'}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="my-4">
                <Col md={4}>
                    <UsuarioDetalles usuario={usuario} />
                    <ButtonsActions
                        itemId={usuario.id}
                        itemName={usuario.nombre}
                        onEdit={handleEdit}
                        onExport={handleExport}
                        detailsRoute="/usuario"
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Usuario;
