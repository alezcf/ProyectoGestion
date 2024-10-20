import React from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import usuarioService from '../../services/usuario.service';
import '../../css/Form.css'; // Importar los estilos

const CrearUsuario = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            await usuarioService.createUsuario(data);
            alert('Usuario creado exitosamente');
            reset(); // Resetea el formulario después del envío
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <Container>
            <div className="form-container">
                <h2 className="text-center mb-4"><FontAwesomeIcon icon={faUser} /> CREAR USUARIO</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="rut">
                                <Form.Label style={{ fontWeight: 'bold' }}>RUT (*)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa el RUT"
                                    {...register('rut', {
                                        required: 'El RUT es obligatorio',
                                        pattern: {
                                            value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
                                            message: 'El RUT no tiene un formato válido'
                                        },
                                        minLength: { value: 9, message: 'El RUT debe tener al menos 9 caracteres' },
                                        maxLength: { value: 12, message: 'El RUT no puede tener más de 12 caracteres' }
                                    })}
                                    className={errors.rut ? 'is-invalid' : ''}
                                />
                                {errors.rut && <span className="text-danger">{errors.rut.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="nombreCompleto">
                                <Form.Label style={{ fontWeight: 'bold' }}>NOMBRE (*)</Form.Label>
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
                                <Form.Label style={{ fontWeight: 'bold' }}>CORREO ELECTRÓNICO (*)</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingresa el email"
                                    {...register('email', {
                                        required: 'El email es obligatorio',
                                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Correo electrónico no válido' },
                                        minLength: { value: 20, message: 'El correo debe tener al menos 20 caracteres' },
                                        maxLength: { value: 50, message: 'El correo debe tener máximo 50 caracteres' }
                                    })}
                                    className={errors.email ? 'is-invalid' : ''}
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="rol">
                                <Form.Label>CARGO LABORAL</Form.Label>
                                <Form.Control
                                    as="select"
                                    {...register('rol', {
                                        required: 'El rol es obligatorio'
                                    })}
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

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="password">
                                <Form.Label style={{ fontWeight: 'bold' }}>CONTRASEÑA (*)</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingresa la contraseña"
                                    {...register('password', {
                                        required: 'La contraseña es obligatoria',
                                        minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                                        pattern: { value: /^[a-zA-Z0-9]+$/, message: 'La contraseña solo puede contener letras y números' }
                                    })}
                                    className={errors.password ? 'is-invalid' : ''}
                                />
                                {errors.password && <span className="text-danger">{errors.password.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="button-container">
                        <button className="button-submit" type="submit"  >
                            <FontAwesomeIcon icon={faPaperPlane} /> CREAR
                        </button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default CrearUsuario;
