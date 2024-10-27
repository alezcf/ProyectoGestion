import React from 'react';
import { Form, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import inventarioService from '../../services/inventario.service';
import '../../css/Form.css';

const CrearInventario = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            await inventarioService.createInventario(data);
            alert('Inventario creado exitosamente');
            reset();
        } catch (err) {
            alert('Error al crear el inventario: ' + err.response.data.message);
        }
    };

    const renderTooltip = (message) => (
        <Tooltip style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{message}</Tooltip>
    );

    return (
        <Container>
            <div className="form-container">
                <h2 className="text-center mb-4"><FontAwesomeIcon icon={faWarehouse} /> CREAR INVENTARIO</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="nombre">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el nombre del inventario. Campo obligatorio.")}
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
                                    {...register('nombre', { required: 'El nombre es obligatorio' })}
                                    className={errors.nombre ? 'is-invalid' : ''}
                                />
                                {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="maximo_stock">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el máximo stock permitido para el inventario. Debe ser mayor a 0.")}
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
                                        min: { value: 1, message: 'El máximo stock debe ser mayor que 0' }
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
            </div>
        </Container>
    );
};

export default CrearInventario;
