import React, { useState } from 'react';
import { Form, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import usuarioService from '../../services/usuario.service';
import '../../css/Form.css';

const CrearUsuario = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const confirmSubmit = async (data) => {
        try {
            await usuarioService.createUsuario(data);
            alert('Usuario creado exitosamente');
            reset();
            setShowConfirmation(false);
        } catch (err) {
            console.log(err);
            alert(err.response.data.details);
            setShowConfirmation(false);
        }
    };

    const renderTooltip = (message) => (
        <Tooltip style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{message}</Tooltip>
    );

    return (
        <Container>
            <div className="form-container">
                <h2 className="text-center mb-4"><FontAwesomeIcon icon={faUser} /> CREAR USUARIO</h2>
                <Form onSubmit={handleSubmit((data) => setShowConfirmation(true))}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="rut">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el RUT del usuario en el formato XX.XXX.XXX-X.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label style={{ fontWeight: 'bold' }}>RUT (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa el RUT"
                                    {...register('rut', {
                                        required: 'El RUT es obligatorio',
                                        pattern: {
                                            value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
                                            message: 'El RUT no tiene un formato válido (12345678-9)'
                                        },
                                        minLength: { value: 9, message: 'El RUT debe tener al menos 9 caracteres' },
                                        maxLength: { value: 12, message: 'El RUT no puede tener más de 10 caracteres' }
                                    })}
                                    className={errors.rut ? 'is-invalid' : ''}
                                />
                                {errors.rut && <span className="text-danger">{errors.rut.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="nombreCompleto">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el nombre completo del usuario, entre 3 y 50 caracteres.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label style={{ fontWeight: 'bold' }}>NOMBRE (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa el nombre completo"
                                    {...register('nombreCompleto', {
                                        required: 'El nombre completo es obligatorio',
                                        minLength: { value: 3, message: 'El nombre completo debe tener al menos 3 caracteres' },
                                        maxLength: { value: 50, message: 'El nombre completo no debe exceder los 50 caracteres' }
                                    })}
                                    className={errors.nombreCompleto ? 'is-invalid' : ''}
                                />
                                {errors.nombreCompleto && <span className="text-danger">{errors.nombreCompleto.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="email">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el correo electrónico del usuario en un formato válido.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label style={{ fontWeight: 'bold' }}>CORREO ELECTRÓNICO (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingresa el email"
                                    {...register('email', {
                                        required: 'El email es obligatorio',
                                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Correo electrónico no válido' },
                                        minLength: { value: 10, message: 'El correo debe tener al menos 10 caracteres' },
                                        maxLength: { value: 50, message: 'El correo debe tener máximo 50 caracteres' }
                                    })}
                                    className={errors.email ? 'is-invalid' : ''}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="rol">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Selecciona el rol laboral del usuario.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label>CARGO LABORAL</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    as="select"
                                    {...register('rol', { required: 'El rol es obligatorio' })}
                                    className={errors.rol ? 'is-invalid' : ''}
                                >
                                    <option value="">Selecciona el rol</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Empleado">Empleado</option>
                                </Form.Control>
                                {errors.rol && <span className="text-danger">{errors.rol.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="button-container">
                        <button className="button-submit" type="button" onClick={() => setShowConfirmation(true)}>
                            <FontAwesomeIcon icon={faPaperPlane} /> CREAR
                        </button>
                    </div>
                </Form>
            </div>

            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Creación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas crear el usuario?</p>
                </Modal.Body>
                <Modal.Footer className="button-container">
                    <button type="button" className="button-previous" onClick={() => setShowConfirmation(false)}>
                        CANCELAR
                    </button>
                    <button type="button" className="button-next" onClick={handleSubmit(confirmSubmit)}>
                        GUARDAR <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CrearUsuario;
