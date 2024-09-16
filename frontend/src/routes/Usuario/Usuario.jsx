import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usuarioService from '../../services/usuario.service'; // Importa el servicio para obtener los datos del usuario
import { Container, Row, Col, Spinner, Alert, Form, Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';  // Importamos react-hook-form para manejar el formulario
import UsuarioDetalles from '../../components/Usuario/UsuarioDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions'; // Importamos el componente
import usuarioFields from '../../fields/usuario.fields'; // Importamos los campos de validación

const Usuario = () => {
    const { usuarioId } = useParams();  // Obtenemos el ID del usuario desde la URL
    const [usuario, setUsuario] = useState(null); // Inicializa el estado como null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar/ocultar el modal

    // useForm setup para manejar el formulario
    const {
        register,  // Registra los campos del formulario
        handleSubmit,  // Maneja el envío del formulario
        formState: { errors },  // Errores de validación
        reset,  // Para resetear el formulario con los valores iniciales
    } = useForm();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                console.log("usuarioid = ", usuarioId);
                const response = await usuarioService.getUsuario(usuarioId); // Usamos el usuarioId de la URL

                if (response) {
                    setUsuario(response); // Asigna los datos solo si existen
                    reset(response); // Inicializa el formulario con los datos del usuario
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
    }, [usuarioId, reset]);

    const handleEdit = () => {
        setShowEditModal(true);  // Muestra el modal de edición
    };

    const handleExport = () => {
        console.log("Exportar los datos del usuario");
        // Implementar lógica de exportación aquí
    };

    const handleFormSubmit = (data) => {
        console.log('Datos actualizados:', data);
        setShowEditModal(false);  // Cierra el modal al enviar
        // Lógica para actualizar los datos del usuario aquí
    };

    const handleCloseModal = () => {
        setShowEditModal(false);  // Cierra el modal sin guardar
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
                        itemName={usuario.nombreCompleto}
                        onEdit={handleEdit}
                        onExport={handleExport}
                    />
                </Col>
            </Row>

            {/* Modal para editar los datos del usuario */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(handleFormSubmit)}>
                        {usuarioFields.map((field, index) => (
                            <Form.Group controlId={field.name} key={index}>
                                <Form.Label>{field.label}</Form.Label>
                                <Form.Control
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.name, field.validation)}  // Registra el campo con validaciones
                                />
                                {errors[field.name] && (
                                    <Alert variant="danger">{errors[field.name].message}</Alert>  // Muestra errores de validación
                                )}
                            </Form.Group>
                        ))}

                        <Button variant="primary" type="submit">
                            Guardar cambios
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Usuario;
