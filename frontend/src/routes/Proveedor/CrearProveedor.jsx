import React from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import proveedorService from '../../services/proveedor.service';
import '../../css/Form.css'; // Importar los estilos

const CrearProveedor = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            await proveedorService.createProveedor(data);
            alert('Proveedor creado exitosamente');
            reset(); // Resetear el formulario
        } catch (err) {
            alert('Error al crear el proveedor: ' + err.response.data.message);
        }
    };

    return (
        <Container>
                    <div className="form-container">
                    <h2 className="text-center mb-4"><FontAwesomeIcon icon={faBuilding} /> NUEVO  PROVEEDOR</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                {/* Campo Nombre */}
                                <Col md={6}>
                                    <Form.Group controlId="nombre">
                                        <Form.Label style={{ fontWeight: 'bold' }}>NOMBRE (*)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa el nombre del proveedor"
                                            {...register('nombre', { required: 'El nombre es obligatorio' })}
                                            className={errors.nombre ? 'is-invalid' : ''}
                                        />
                                        {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                                    </Form.Group>
                                </Col>

                                {/* Campo RUT */}
                                <Col md={6}>
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
                                            className={errors.rut ? 'is-invalid' : ''}
                                        />
                                        {errors.rut && <span className="text-danger">{errors.rut.message}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                {/* Campo Dirección */}
                                <Col md={6}>
                                    <Form.Group controlId="direccion">
                                        <Form.Label>DIRECCIÓN</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa la dirección"
                                            {...register('direccion', { required: 'La dirección es obligatoria' })}
                                            className={errors.direccion ? 'is-invalid' : ''}
                                        />
                                        {errors.direccion && <span className="text-danger">{errors.direccion.message}</span>}
                                    </Form.Group>
                                </Col>

                                {/* Campo Teléfono */}
                                <Col md={6}>
                                    <Form.Group controlId="telefono">
                                        <Form.Label style={{ fontWeight: 'bold' }}>TELÉFONO MÓVIL (*)</Form.Label>
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
                                            className={errors.telefono ? 'is-invalid' : ''}
                                        />
                                        {errors.telefono && <span className="text-danger">{errors.telefono.message}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                {/* Campo Email */}
                                <Col md={6}>
                                    <Form.Group controlId="email">
                                        <Form.Label>CORREO ELECTRÓNICO</Form.Label>
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
                                            className={errors.email ? 'is-invalid' : ''}
                                        />
                                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="button-container">
                                <button className="button-submit" type="submit">
                                    <FontAwesomeIcon icon={faPaperPlane} /> REGISTRAR
                                </button>
                            </div>
                        </Form>
                    </div>
        </Container>
    );
};

export default CrearProveedor;
