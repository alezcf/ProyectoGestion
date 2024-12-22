import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usuarioService from '../../services/usuario.service'; // Servicio para obtener los datos del usuario
import { Container, Row, Col, Spinner, Alert, Button, Collapse, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import UsuarioDetalles from '../../components/Usuario/UsuarioDetalles'; // Detalles del usuario
import UsuarioBotones from '../../components/Common/ButtonsActions'; // Botones para acciones
import usuarioFields from '../../fields/usuario.fields'; // Campos del formulario de usuario
import DefaultEditModal from '../../components/Common/DefaultEditModal'; // Modal para editar
import { exportObjectAndArraysToExcel } from '../../services/export.service'; // Servicio de exportación
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic';
import '../../css/Form.css';
import '../../css/Inventario.css';
import '../../css/Modal.css';

const Usuario = () => {
    const { usuarioId } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);
    const [forceUpdate, setForceUpdate] = useState(false);
    const defaultProfileImage = '../images/avatar.png';

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await usuarioService.getUsuario(usuarioId);
                setUsuario(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el usuario.');
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [usuarioId]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleExport = async () => {
        try {
            const dataObject = {
                RUT: usuario.rut,
                EMAIL: usuario.email,
                ROL: usuario.rol,
                "NOMBRE COMPLETO": usuario.nombreCompleto,
                "FECHA DE REGISTRO": formatDateToDDMMYYYY(usuario.createdAt),
                "ÚLTIMA ACTUALIZACIÓN": formatDateToDDMMYYYY(usuario.updatedAt),
                "ACTIVO": usuario.isActive ? "Sí" : "No",
            };

            const sheetNames = {
                mainSheet: "Usuario",
            };

            const arrayData = [[]];

            await exportObjectAndArraysToExcel(dataObject, arrayData, sheetNames);
        } catch (error) {
            console.error('Error al exportar los datos del usuario:', error);
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            const response = await usuarioService.updateUsuario(usuario.rut, data);
            setUsuario({ ...usuario, ...data });
            setShowEditModal(false);
            alert(response.message);
        } catch (error) {
            alert(error);
            console.error('Error al actualizar el usuario:', error);
        }
    };

    const handleToggleStatus = async () => {
        try {
            const message = await usuarioService.toggleUsuarioStatus(usuarioId);
            setUsuario((prevUsuario) => ({
                ...prevUsuario,
                isActive: !prevUsuario.isActive,
            }));
            setForceUpdate(!forceUpdate); // Fuerza el rerenderizado
            alert(message);
        } catch (error) {
            alert('Error al cambiar el estado del usuario');
            console.error('Error al cambiar el estado del usuario:', error);
        }
    };



    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const toggleDetalles = () => {
        setOpenDetalles(!openDetalles);
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando usuario...
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
                        src={usuario.fotoPerfil || defaultProfileImage} // Usa imagen predefinida si no tiene foto
                        fluid
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            maxHeight: '500px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    />
<UsuarioBotones
    onEdit={handleEdit}
    onExport={handleExport}
    onDelete={handleToggleStatus}
    isDeleteDisabled={!usuario.isActive} // Si está inactivo, el botón será "Activar"
    isDisabled={false} // Por defecto, el botón está habilitado
    isDeleteMode={false} // Siempre alterna entre "Activar" y "Desactivar"
    usuario={usuario}
/>
{console.log("Estado actual del usuario:", usuario.isActive)}

                </Col>
                <Col md={8}>
                    {/* Collapse para los detalles del usuario */}
                    <Card className={`mb-3 custom-card ${openDetalles ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Detalles del Usuario</h5>
                            <Button
                                onClick={toggleDetalles}
                                aria-controls="detalles-usuario"
                                aria-expanded={openDetalles}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openDetalles ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Collapse in={openDetalles}>
                            <div id="detalles-usuario">
                                <Card.Body>
                                    <UsuarioDetalles usuario={usuario} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>
                </Col>
            </Row>

            {/* Modal para editar el usuario */}
            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={usuarioFields}
                defaultValues={usuario}
                onSubmit={handleFormSubmit}
                title="EDITAR USUARIO"
            />
        </Container>
    );
};

export default Usuario;
