import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usuarioService from '../../services/usuario.service'; // Servicio para obtener los datos del usuario
import { Container, Row, Col, Spinner, Alert, Card, Image} from 'react-bootstrap';
import PerfilInfo from '../../components/Perfil/PerfilInfo'; // Detalles del perfil
import UsuarioBotones from '../../components/Common/ButtonsActions'; // Botones para acciones
import usuarioFields from '../../fields/usuario.fields'; // Campos del formulario de usuario
import DefaultEditModal from '../../components/Common/DefaultEditModal'; // Modal para editar
import '../../css/Inventario.css';

const Perfil = () => {
    const { usuarioId } = useParams();
    const [perfilData, setPerfilData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false); // Estado para manejar el modal de edición
    const defaultProfileImage = '../images/avatar.png';
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await usuarioService.getUsuario(usuarioId);
                setPerfilData(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el perfil.');
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [usuarioId]);

    const handleEdit = () => {
        setShowEditModal(true); // Muestra el modal de edición
    };

    const handleExport = () => {
        console.log("Exportar los datos del perfil");
        // Aquí puedes implementar la lógica de exportación
    };

    const handleFormSubmit = async (data) => {
        try {
            await usuarioService.updateUsuario(usuarioId, data);
            setPerfilData({ ...perfilData, ...data });
            setShowEditModal(false);
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando perfil...
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="form-container">
            <Row className="my-4">
                <Col md={4}>
                    <Image
                            src={defaultProfileImage} // Usa imagen predefinida si no tiene foto
                            fluid
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                maxHeight: '500px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    <UsuarioBotones onEdit={handleEdit} onExport={handleExport} />
                </Col>
                <Col md={8}>
                    {/* Detalles del perfil */}
                    <Card className="mb-3 custom-card card-active">
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Detalles del Perfil</h5>
                        </Card.Header>
                        <Card.Body>
                            <PerfilInfo perfilData={perfilData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para editar el perfil */}
            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={usuarioFields}
                defaultValues={perfilData}
                onSubmit={handleFormSubmit}
                title="EDITAR PERFIL"
            />
        </Container>
    );
};

export default Perfil;
