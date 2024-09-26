import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'; // Importar useForm de RHF
import usuarioService from '../../services/usuario.service'; // Asegúrate de tener este servicio

const CrearUsuario = () => {
    // Inicializa el hook useForm
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Esta función manejará el envío del formulario
    const onSubmit = async (data) => {
        try {
            console.log(data);
            await usuarioService.createUsuario(data);
            alert('Usuario creado exitosamente');
            reset(); // Resetea el formulario después del envío
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2>Crear Usuario</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="nombreCompleto">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre completo"
                                {...register('nombreCompleto', {
                                    required: 'El nombre completo es obligatorio',
                                    minLength: {
                                        value: 3,
                                        message: 'El nombre completo debe tener al menos 3 caracteres'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'El nombre completo no debe exceder los 50 caracteres'
                                    }
                                })}
                            />
                            {errors.nombreCompleto && (
                                <span className="text-danger">{errors.nombreCompleto.message}</span>
                            )}
                        </Form.Group>

                        <Form.Group controlId="rut">
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el RUT"
                                {...register('rut', {
                                    required: 'El RUT es obligatorio',
                                    pattern: {
                                        value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
                                        message: 'El RUT no tiene un formato válido'
                                    },
                                    minLength: {
                                        value: 9,
                                        message: 'El RUT debe tener al menos 9 caracteres'
                                    },
                                    maxLength: {
                                        value: 12,
                                        message: 'El RUT no puede tener más de 12 caracteres'
                                    }
                                })}
                            />
                            {errors.rut && (
                                <span className="text-danger">{errors.rut.message}</span>
                            )}
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa el email"
                                {...register('email', {
                                    required: 'El email es obligatorio',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Correo electrónico no válido'
                                    },
                                    minLength: {
                                        value: 20,
                                        message: 'El correo debe tener al menos 20 caracteres'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'El correo debe tener máximo 50 caracteres'
                                    }
                                })}
                            />
                            {errors.email && (
                                <span className="text-danger">{errors.email.message}</span>
                            )}
                        </Form.Group>

                        <Form.Group controlId="rol">
                            <Form.Label>Rol</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el rol"
                                {...register('rol', {
                                    required: 'El rol es obligatorio',
                                    minLength: {
                                        value: 4,
                                        message: 'El rol debe tener al menos 4 caracteres'
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: 'El rol debe tener máximo 15 caracteres'
                                    }
                                })}
                            />
                            {errors.rol && (
                                <span className="text-danger">{errors.rol.message}</span>
                            )}
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa la contraseña"
                                {...register('password', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: {
                                        value: 6,
                                        message: 'La contraseña debe tener al menos 6 caracteres'
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9]+$/,
                                        message: 'La contraseña solo puede contener letras y números'
                                    }
                                })}
                            />
                            {errors.password && (
                                <span className="text-danger">{errors.password.message}</span>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Crear Usuario
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CrearUsuario;
