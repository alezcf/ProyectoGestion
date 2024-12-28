import React, { useState } from 'react';
import { Form, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import inventarioService from '../../services/inventario.service';
import '../../css/Form.css';

const CrearInventario = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const confirmSubmit = async (data) => {
        try {
            await inventarioService.createInventario(data);
            alert('Inventario creado exitosamente');
            reset();
            setShowConfirmation(false);
        } catch (err) {
            alert('Error al crear el inventario: ' + err.response.data.message);
            setShowConfirmation(false);
        }
    };

    const renderTooltip = (message) => (
        <Tooltip style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{message}</Tooltip>
    );

    return (
        <Container>
            <div className="form-container">
                <h2 className="text-center mb-4"><FontAwesomeIcon icon={faWarehouse} /> CREAR INVENTARIO</h2>
                <Form onSubmit={handleSubmit(() => setShowConfirmation(true))}>
                    <Row>
                        <Col md={6}>
                        <Form.Group controlId="nombre">
                            <OverlayTrigger
                                placement="auto"
                                overlay={renderTooltip("Introduce el nombre del inventario. Debe tener entre 3 y 100 caracteres, no puede estar vacío ni ser solo números.")}
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
                                placeholder="Ingresa el nombre del inventario"
                                {...register('nombre', {
                                    required: 'El nombre es obligatorio',
                                    minLength: {
                                        value: 3,
                                        message: 'El nombre debe tener al menos 3 caracteres',
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'El nombre debe tener como máximo 100 caracteres',
                                    },
                                    validate: (value) => {
                                        if (/^\d+$/.test(value)) {
                                            return 'El nombre no puede contener solo números';
                                        }
                                        return true;
                                    }
                                })}
                                className={errors.nombre ? 'is-invalid' : ''}
                            />
                            {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                        </Form.Group>

                        </Col>

                        <Col md={6}>
                        <Form.Group controlId="maximo_stock">
                            <OverlayTrigger
                                placement="auto"
                                overlay={renderTooltip("Introduce el máximo stock permitido para el inventario. Debe ser un número entero entre 2 y 1500.")}
                                popperConfig={{
                                    modifiers: [
                                        { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                    ]
                                }}
                            >
                                <Form.Label style={{ fontWeight: 'bold' }}>MÁXIMO STOCK (*)</Form.Label>
                            </OverlayTrigger>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa el máximo stock del inventario"
                                {...register('maximo_stock', {
                                    required: 'El máximo stock es obligatorio',
                                    min: {
                                        value: 2,
                                        message: 'El máximo stock debe ser mayor o igual a 2',
                                    },
                                    max: {
                                        value: 1500,
                                        message: 'El máximo stock debe ser menor o igual a 1500',
                                    },
                                    validate: (value) => {
                                        if (!Number.isInteger(Number(value))) {
                                            return 'El máximo stock debe ser un número entero';
                                        }
                                        return true;
                                    },
                                })}
                                className={errors.maximo_stock ? 'is-invalid' : ''}
                            />
                            {errors.maximo_stock && <span className="text-danger">{errors.maximo_stock.message}</span>}
                        </Form.Group>

                        </Col>
                    </Row>

                    <div className="button-container">
                        <button className="button-submit" type="submit">
                            <FontAwesomeIcon icon={faPaperPlane} /> CREAR
                        </button>
                    </div>
                </Form>

                {/* Modal de Confirmación */}
                <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Estás seguro de que deseas crear el inventario?</Modal.Body>
                    <Modal.Footer>
                        <button
                            className="button-previous"
                            onClick={() => setShowConfirmation(false)}
                        >
                            CANCELAR
                        </button>
                        <button
                            className="button-next"
                            onClick={handleSubmit(confirmSubmit)}
                        >
                            GUARDAR <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Container>
    );
};

export default CrearInventario;
