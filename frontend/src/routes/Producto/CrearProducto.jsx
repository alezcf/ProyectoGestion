import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft, faArrowRight, faBottleDroplet } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import productoService from '../../services/producto.service';
import constantsService from '../../services/constant.service';
import '../../css/Form.css';
import '../../css/Buttons.css';

const CrearProducto = () => {
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm({
        defaultValues: {
            nombre: "",
            descripcion: "",
            marca: "",
            contenido: "",
            unidad_medida: "",
            precio: "",
            categoria: "",
            tipo: "",
            imagen: null
        }
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [page, setPage] = useState(0);
    const [constants, setConstants] = useState({ categorias: [], medidas: [], tipos: [] });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const totalPages = 2;

    useEffect(() => {
        const fetchConstants = async () => {
            try {
                const data = await constantsService.getConstants();
                setConstants(data);
            } catch (error) {
                console.error('Error al obtener las constantes:', error);
            }
        };
        fetchConstants();
    }, []);

    const confirmSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'imagen' && data[key] && data[key][0]) {
                    formData.append('imagen', data[key][0]);
                } else if (key !== 'imagen' && data[key]) {
                    formData.append(key, data[key]);
                }
            });

            await productoService.createProducto(formData);
            alert('Producto creado exitosamente');
            reset();
            setImagePreview(null);
            setPage(0);
            setShowConfirmation(false);
        } catch (err) {
            console.log('Error al crear el producto:', err.response.data.details);
            alert('Error al crear el producto: ' + err.response.data.details);
            setShowConfirmation(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const nextPage = async (e) => {
        e.preventDefault();
        if (page === 0) {
            const result = await trigger(['nombre', 'descripcion', 'marca', 'contenido', 'unidad_medida', 'precio']);
            if (result) {
                setPage(page + 1);
            }
        } else {
            if (page < totalPages - 1) setPage(page + 1);
        }
    };

    const previousPage = (e) => {
        e.preventDefault();
        if (page > 0) setPage(page - 1);
    };

    const renderTooltip = (message) => (
        <Tooltip style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{message}</Tooltip>
    );
    const renderPageFields = () => {
        switch (page) {
            case 0:
                return (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="nombre">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Introduce el nombre del producto. Requerido y debe tener entre 3 y 255 caracteres.")}
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
                                        placeholder="Ingresa el nombre del producto"
                                        {...register('nombre', {
                                            required: "El nombre es obligatorio.",
                                            minLength: { value: 3, message: "Debe tener como mínimo 3 caracteres." },
                                            maxLength: { value: 50, message: "Debe tener como máximo 50 caracteres." },
                                            validate: {
                                                notOnlyNumbers: (value) =>
                                                    !/^\d+$/.test(value) || "El nombre no puede contener solo números.",
                                            },
                                        })}
                                        className={`form-input ${errors.nombre ? 'is-invalid' : ''}`}
                                    />
                                    {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="descripcion">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Introduce una breve descripción del producto. Requerido, debe tener entre 5 y 1000 caracteres.")}
                                        popperConfig={{
                                            modifiers: [
                                                { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                            ]
                                        }}
                                    >
                                        <Form.Label style={{ fontWeight: 'bold' }}>DESCRIPCIÓN (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la descripción"
                                        {...register('descripcion', {
                                            required: "La descripción es obligatoria.",
                                            minLength: { value: 5, message: "Debe tener como mínimo 5 caracteres." },
                                            maxLength: { value: 1000, message: "Debe tener como máximo 1000 caracteres." },
                                            validate: {
                                                notOnlyNumbers: (value) =>
                                                    !/^\d+$/.test(value) || "La descripción no puede contener solo números.",
                                            },
                                        })}
                                        className={`form-input ${errors.descripcion ? 'is-invalid' : ''}`}
                                    />
                                    {errors.descripcion && <span className="text-danger">{errors.descripcion.message}</span>}
                                </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="marca">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Introduce la marca del producto, hasta 255 caracteres.")}
                                        popperConfig={{
                                            modifiers: [
                                                { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                            ]
                                        }}
                                    >
                                        <Form.Label>MARCA</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la marca"
                                        {...register('marca', {
                                            maxLength: { value: 255, message: "Debe tener como máximo 255 caracteres." }
                                        })}
                                        className={`form-input ${errors.marca ? 'is-invalid' : ''}`}
                                    />
                                    {errors.marca && <span className="text-danger">{errors.marca.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                            <Form.Group controlId="contenido">
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={renderTooltip("Introduce el contenido en unidades, debe ser un número positivo entre 1 y 1000. Requerido.")}
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label style={{ fontWeight: 'bold' }}>CONTENIDO (*)</Form.Label>
                                </OverlayTrigger>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingresa el contenido"
                                    {...register('contenido', {
                                        required: "El contenido es obligatorio en formato numérico.",
                                        min: { value: 1, message: "Debe ser un número mayor o igual a 1." },
                                        max: { value: 1000, message: "Debe ser un número menor o igual a 1000." },
                                        validate: {
                                            isPositive: (value) =>
                                                /^\d+$/.test(value) || "El contenido debe ser un número válido y positivo."
                                        }
                                    })}
                                    className={`form-input ${errors.contenido ? 'is-invalid' : ''}`}
                                />
                                {errors.contenido && <span className="text-danger">{errors.contenido.message}</span>}
                            </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="unidad_medida">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Selecciona la unidad de medida para el contenido del producto. Requerido.")}
                                        popperConfig={{
                                            modifiers: [
                                                { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                            ]
                                        }}
                                    >
                                        <Form.Label style={{ fontWeight: 'bold' }}>UNIDAD DE MEDIDA (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        as="select"
                                        {...register('unidad_medida', { required: "La unidad de medida es obligatoria." })}
                                        className={`form-input ${errors.unidad_medida ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Seleccione una unidad de medida</option>
                                        {constants.medidas.map((medida, index) => (
                                            <option key={index} value={medida}>{medida}</option>
                                        ))}
                                    </Form.Control>
                                    {errors.unidad_medida && <span className="text-danger">{errors.unidad_medida.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="precio">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Introduce el precio del producto. Requerido y debe ser un número positivo.")}
                                        popperConfig={{
                                            modifiers: [
                                                { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                            ]
                                        }}
                                    >
                                        <Form.Label style={{ fontWeight: 'bold' }}>PRECIO (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa el precio"
                                        {...register('precio', {
                                            required: "El precio es obligatorio en formato numérico.",
                                            min: { value: 10, message: "El precio debe ser mínimo 10." },
                                            max: { value: 1000000, message: "El precio debe ser máximo 1.000.000." },
                                            validate: {
                                                isPositive: (value) =>
                                                    /^\d+$/.test(value) || "El contenido debe ser un número válido y positivo."
                                            },
                                        })}
                                        className={`form-input ${errors.precio ? 'is-invalid' : ''}`}
                                    />
                                    {errors.precio && <span className="text-danger">{errors.precio.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                );
            case 1:
                return (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="categoria">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Selecciona la categoría del producto. Requerido.")}
                                        popperConfig={{
                                            modifiers: [
                                                { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                            ]
                                        }}
                                    >
                                        <Form.Label style={{ fontWeight: 'bold' }}>CATEGORIA (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        as="select"
                                        {...register('categoria', { required: "La categoría es obligatoria." })}
                                        className={`form-input ${errors.categoria ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {constants.categorias.map((categoria, index) => (
                                            <option key={index} value={categoria}>{categoria}</option>
                                        ))}
                                    </Form.Control>
                                    {errors.categoria && <span className="text-danger">{errors.categoria.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="tipo">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Selecciona el tipo del producto. Requerido.")}
                                        popperConfig={{
                                            modifiers: [
                                                { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                            ]
                                        }}
                                    >
                                        <Form.Label style={{ fontWeight: 'bold' }}>TIPO (*)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        as="select"
                                        {...register('tipo', { required: "El tipo es obligatorio." })}
                                        className={`form-input ${errors.tipo ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Seleccione un tipo</option>
                                        {constants.tipos.map((tipo, index) => (
                                            <option key={index} value={tipo}>{tipo}</option>
                                        ))}
                                    </Form.Control>
                                    {errors.tipo && <span className="text-danger">{errors.tipo.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="imagen">
                                    <OverlayTrigger
                                        placement="auto"
                                        overlay={renderTooltip("Sube una imagen del producto en formato PNG o JPG.")}
                                        popperConfig={{
                                            modifiers: [
                                                { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                            ]
                                        }}
                                    >
                                        <Form.Label>IMAGEN (PNG O JPG)</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="file"
                                        accept=".png, .jpg"
                                        {...register('imagen')}
                                        onChange={handleImageChange}
                                        className={`form-input ${errors.imagen ? 'is-invalid' : ''}`}
                                    />
                                    {errors.imagen && <span className="text-danger">{errors.imagen.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6} className="d-flex align-items-center">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Previsualización" className="img-preview" />
                                )}
                            </Col>
                        </Row>
                    </>
                );
            default:
                return null;
        }
    };


    return (
        <Container fluid className="form-container">
            <h2 className="text-center mb-4"><FontAwesomeIcon icon={faBottleDroplet} /> REGISTRAR PRODUCTO</h2>
            <Form onSubmit={handleSubmit((data) => setShowConfirmation(true))}>
                {renderPageFields()}
                <div className="button-container">
                    <button className="button-previous" onClick={previousPage} disabled={page === 0}>
                        <FontAwesomeIcon icon={faArrowLeft} /> ATRÁS
                    </button>

                    {page < totalPages - 1 ? (
                        <button className="button-next" onClick={nextPage}>
                            SIGUIENTE <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    ) : (
                        <button className="button-submit" type="button" onClick={() => setShowConfirmation(true)}>
                            <FontAwesomeIcon icon={faPaperPlane} /> CREAR
                        </button>
                    )}
                </div>
            </Form>

            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Creación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas crear el producto?</p>
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

export default CrearProducto;
