import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import proveedorService from '../../services/proveedor.service'; // Servicio para crear proveedor

const CrearProveedor = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            await proveedorService.createProveedor(data); // Servicio para enviar el proveedor
            alert('Proveedor creado exitosamente');
            reset(); // Resetear el formulario
        } catch (err) {
            alert('Error al crear el proveedor: ' + err.response.data.message);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2>Crear Proveedor</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {/* Campo Nombre */}
                        <Form.Group controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre del proveedor"
                                {...register('nombre', { required: 'El nombre es obligatorio' })}
                            />
                            {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                        </Form.Group>

                        {/* Campo RUT */}
                        <Form.Group controlId="rut">
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el RUT del proveedor"
                                {...register('rut', {
                                    required: 'El RUT es obligatorio',
                                    pattern: {
                                        value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
                                        message: 'Formato de RUT no válido',
                                    }
                                })}
                            />
                            {errors.rut && <span className="text-danger">{errors.rut.message}</span>}
                        </Form.Group>

                        {/* Campo Dirección */}
                        <Form.Group controlId="direccion">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa la dirección"
                                {...register('direccion', { required: 'La dirección es obligatoria' })}
                            />
                            {errors.direccion && <span className="text-danger">{errors.direccion.message}</span>}
                        </Form.Group>

                        {/* Campo Teléfono */}
                        <Form.Group controlId="telefono">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el teléfono"
                                {...register('telefono', {
                                    required: 'El teléfono es obligatorio',
                                    pattern: {
                                        value: /^[0-9]{9,10}$/,
                                        message: 'Formato de teléfono no válido, debe tener 9 o 10 dígitos',
                                    }
                                })}
                            />
                            {errors.telefono && <span className="text-danger">{errors.telefono.message}</span>}
                        </Form.Group>

                        {/* Campo Email */}
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa el email"
                                {...register('email', {
                                    required: 'El email es obligatorio',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Formato de correo electrónico no válido',
                                    }
                                })}
                            />
                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Crear Proveedor
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CrearProveedor;
