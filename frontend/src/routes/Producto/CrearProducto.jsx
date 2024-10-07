import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import productoService from '../../services/producto.service';
import '../../css/Form.css';
import '../../css/Buttons.css';

const CrearProducto = () => {
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
        defaultValues: {
            nombre: "",
            descripcion: "",
            marca: "",
            cantidad: "",
            unidad_medida: "",
            precio: "",
            categoria: "",
            tipo: "",
            imagen: null
        }
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [page, setPage] = useState(0); // Controla la página actual

    const totalPages = 2; // Hay dos páginas

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('nombre', data.nombre);
            formData.append('descripcion', data.descripcion);
            formData.append('marca', data.marca);
            formData.append('cantidad', data.cantidad);
            formData.append('unidad_medida', data.unidad_medida);
            formData.append('precio', data.precio);
            formData.append('categoria', data.categoria);
            formData.append('tipo', data.tipo);
            if (data.imagen[0]) {
                formData.append('imagen', data.imagen[0]);
            }

            await productoService.createProducto(formData);
            alert('Producto creado exitosamente');
            reset(); // Resetear el formulario después de enviar
            setImagePreview(null); // Resetear la previsualización de la imagen
            setPage(0); // Volver a la primera página después de la creación exitosa
        } catch (err) {
            alert('Error al crear el producto: ' + err.response.data.message);
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

    const nextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const previousPage = () => {
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
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el nombre del producto"
                                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                                        className={`form-input ${errors.nombre ? 'is-invalid' : ''}`}
                                    />
                                    {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="descripcion">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la descripción"
                                        {...register('descripcion', { required: 'La descripción es obligatoria' })}
                                        className={`form-input ${errors.descripcion ? 'is-invalid' : ''}`}
                                    />
                                    {errors.descripcion && <span className="text-danger">{errors.descripcion.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="marca">
                                    <Form.Label>Marca</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la marca"
                                        {...register('marca', { required: 'La marca es obligatoria' })}
                                        className={`form-input ${errors.marca ? 'is-invalid' : ''}`}
                                    />
                                    {errors.marca && <span className="text-danger">{errors.marca.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="cantidad">
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa la cantidad"
                                        {...register('cantidad', { required: 'La cantidad es obligatoria' })}
                                        className={`form-input ${errors.cantidad ? 'is-invalid' : ''}`}
                                    />
                                    {errors.cantidad && <span className="text-danger">{errors.cantidad.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="unidad_medida">
                                    <Form.Label>Unidad de Medida</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la unidad de medida"
                                        {...register('unidad_medida', { required: 'La unidad de medida es obligatoria' })}
                                        className={`form-input ${errors.unidad_medida ? 'is-invalid' : ''}`}
                                    />
                                    {errors.unidad_medida && <span className="text-danger">{errors.unidad_medida.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="precio">
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa el precio"
                                        {...register('precio', { required: 'El precio es obligatorio' })}
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
                                    <Form.Label>Categoría</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa la categoría"
                                        {...register('categoria', { required: 'La categoría es obligatoria' })}
                                        className={`form-input ${errors.categoria ? 'is-invalid' : ''}`}
                                    />
                                    {errors.categoria && <span className="text-danger">{errors.categoria.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="tipo">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa el tipo"
                                        {...register('tipo', { required: 'El tipo es obligatorio' })}
                                        className={`form-input ${errors.tipo ? 'is-invalid' : ''}`}
                                    />
                                    {errors.tipo && <span className="text-danger">{errors.tipo.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="imagen">
                                    <Form.Label>Imagen (solo PNG)</Form.Label>
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
            <h2 className="text-center mb-4">Crear Producto</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {renderPageFields()}
                <div className="d-flex justify-content-between mt-4">
                    {page > 0 && (
                        <Button variant="secondary" onClick={previousPage}>
                            Anterior
                        </Button>
                    )}
                    {page < totalPages - 1 ? (
                        <Button variant="primary" className="button-next" onClick={nextPage}>
                            Siguiente
                        </Button>
                    ) : (
                        <Button variant="primary" type="submit">
                            Crear Producto
                        </Button>
                    )}
                </div>
            </Form>
        </Container>
    );
};

export default CrearProducto;
