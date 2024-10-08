import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
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
    const [page, setPage] = useState(0); // Controla la página actual
    const [constants, setConstants] = useState({ categorias: [], medidas: [], tipos: [] });

    const totalPages = 2; // Hay dos páginas

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

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'imagen' && data[key] && data[key][0]) {
                    formData.append('imagen', data[key][0]);
                } else if (key !== 'imagen' && data[key]) {
                    formData.append(key, data[key]);
                }
            });

            console.log(formData);
            await productoService.createProducto(formData);
            alert('Producto creado exitosamente');
            reset(); // Resetear el formulario después de enviar
            setImagePreview(null); // Resetear la previsualización de la imagen
            setPage(0); // Volver a la primera página después de la creación exitosa
        } catch (err) {
            alert('Error al crear el producto: ' + err.response);
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

    const renderPageFields = () => {
        switch (page) {
            case 0:
                return (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="nombre">
                                    <Form.Label style={{ fontWeight: 'bold' }}>NOMBRE (*)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el nombre del producto"
                                        {...register('nombre', {
                                            required: "El nombre es obligatorio.",
                                            minLength: {
                                                value: 3,
                                                message: "El nombre debe tener como mínimo 3 caracteres."
                                            },
                                            maxLength: {
                                                value: 255,
                                                message: "El nombre debe tener como máximo 255 caracteres."
                                            }
                                        })}
                                        className={`form-input ${errors.nombre ? 'is-invalid' : ''}`}
                                    />
                                    {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="descripcion">
                                    <Form.Label style={{ fontWeight: 'bold' }}>DESCRIPCIÓN (*)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la descripción"
                                        {...register('descripcion', {
                                            required: "La descripción es obligatoria.",
                                            maxLength: {
                                                value: 1000,
                                                message: "La descripción debe tener como máximo 1000 caracteres."
                                            }
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
                                    <Form.Label>MARCA</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la marca"
                                        {...register('marca', {
                                            maxLength: {
                                                value: 255,
                                                message: "La marca debe tener como máximo 255 caracteres."
                                            }
                                        })}
                                        className={`form-input ${errors.marca ? 'is-invalid' : ''}`}
                                    />
                                    {errors.marca && <span className="text-danger">{errors.marca.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="contenido">
                                    <Form.Label>CONTENIDO</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa el contenido"
                                        {...register('contenido', {
                                            min: {
                                                value: 0,
                                                message: "El contenido debe ser un número positivo."
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
                                    <Form.Label>UNIDAD DE MEDIDA</Form.Label>
                                    <Form.Control
                                        as="select"
                                        {...register('unidad_medida')}
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
                                    <Form.Label>PRECIO</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa el precio"
                                        {...register('precio', {
                                            min: {
                                                value: 0,
                                                message: "El precio debe ser un número positivo."
                                            }
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
                                    <Form.Label style={{ fontWeight: 'bold' }}>CATEGORIA (*)</Form.Label>
                                    <Form.Control
                                        as="select"
                                        {...register('categoria', {
                                            required: "La categoría es obligatoria."
                                        })}
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
                                    <Form.Label style={{ fontWeight: 'bold' }}>TIPO (*)</Form.Label>
                                    <Form.Control
                                        as="select"
                                        {...register('tipo', {
                                            required: "El tipo es obligatorio.",
                                        })}
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
                                    <Form.Label>IMAGEN (solo PNG)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".png"
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
            <Form onSubmit={handleSubmit(onSubmit)}>
                {renderPageFields()}
                <div className="button-container">
                    <button
                        className="button-previous"
                        onClick={previousPage}
                        disabled={page === 0} /* Bloquea el botón si estamos en la primera página */
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> ATRÁS
                    </button>

                    {page < totalPages - 1 ? (
                        <button className="button-next" onClick={nextPage}>
                            SIGUIENTE <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    ) : (
                        <button className="button-submit" type="submit"  >
                            <FontAwesomeIcon icon={faPaperPlane} /> CREAR
                        </button>
                    )}
                </div>

            </Form>
        </Container>
    );
};

export default CrearProducto;