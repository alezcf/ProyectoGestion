import React, { useState } from 'react';
import { Form, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import proveedorService from '../../services/proveedor.service';
import '../../css/Form.css';

const CrearProveedor = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const confirmSubmit = async (data) => {
        try {
            await proveedorService.createProveedor(data);
            alert('Proveedor creado exitosamente');
            reset(); // Resetear el formulario
            setShowConfirmation(false);
        } catch (err) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
            setShowConfirmation(false);
        }
    };

    const renderTooltip = (message) => (
        <Tooltip style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{message}</Tooltip>
    );

    return (
        <Container>
            <div className="form-container">
                <h2 className="text-center mb-4"><FontAwesomeIcon icon={faBuilding} /> NUEVO PROVEEDOR</h2>
                <Form onSubmit={handleSubmit((data) => setShowConfirmation(true))}>
                    <Row>
                        {/* Campo Nombre */}
                        <Col md={6}>
                        <Form.Group controlId="nombre">
                        <OverlayTrigger
                            placement="auto"
                            overlay={renderTooltip("Introduce el nombre del proveedor. Campo obligatorio. Debe tener entre 3 y 50 caracteres y no puede ser solo números.")}
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
                            placeholder="Ingresa el nombre del proveedor"
                            {...register('nombre', {
                                required: "El nombre es obligatorio.",
                                minLength: { value: 3, message: "Debe tener como mínimo 3 caracteres." },
                                maxLength: { value: 50, message: "Debe tener como máximo 50 caracteres." },
                                validate: {
                                    notOnlyNumbers: (value) =>
                                        !/^\d+$/.test(value) || "El nombre no puede contener solo números.",
                                },
                            })}
                            className={errors.nombre ? 'is-invalid' : ''}
                        />
                        {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                    </Form.Group>

                        </Col>

                        {/* Campo RUT */}
                        <Col md={6}>
                            <Form.Group controlId="rut">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el RUT del proveedor en formato XX.XXX.XXX-X. Campo obligatorio.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label>RUT</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa el RUT del proveedor"
                                    {...register('rut', {
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
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce la dirección del proveedor. Campo obligatorio.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label>DIRECCIÓN</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa la dirección"
                                    {...register('direccion')}
                                    className={errors.direccion ? 'is-invalid' : ''}
                                />
                                {errors.direccion && <span className="text-danger">{errors.direccion.message}</span>}
                            </Form.Group>
                        </Col>

                        {/* Campo Teléfono */}
                        <Col md={6}>
                            <Form.Group controlId="telefono">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el teléfono móvil del proveedor, debe tener 9 o 10 dígitos.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label style={{ fontWeight: 'bold' }}>TELÉFONO MÓVIL (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa el teléfono"
                                    {...register('telefono', {
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
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el correo electrónico del proveedor en un formato válido.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label>CORREO ELECTRÓNICO</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingresa el email"
                                    {...register('email', {
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
                        <button className="button-submit" type="button" onClick={() => setShowConfirmation(true)}>
                            <FontAwesomeIcon icon={faPaperPlane} /> REGISTRAR
                        </button>
                    </div>
                </Form>
            </div>

            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Creación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas crear el proveedor?</p>
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

export default CrearProveedor;
