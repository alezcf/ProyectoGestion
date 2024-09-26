import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import productoService from '../../services/producto.service'; // Servicio para crear producto

const CrearProducto = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [imagePreview, setImagePreview] = useState(null); // Para previsualizar la imagen

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
                formData.append('imagen', data.imagen[0]); // Subir la imagen
            }

            await productoService.createProducto(formData); // Servicio para enviar el producto
            alert('Producto creado exitosamente');
            reset(); // Resetear el formulario
            setImagePreview(null); // Limpiar la previsualización de imagen
        } catch (err) {
            alert('Error al crear el producto: ' + err.response.data.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Actualizar previsualización
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2>Crear Producto</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre del producto"
                                {...register('nombre', { required: 'El nombre es obligatorio' })}
                            />
                            {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                        </Form.Group>

                        <Form.Group controlId="descripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa la descripción"
                                {...register('descripcion', { required: 'La descripción es obligatoria' })}
                            />
                            {errors.descripcion && <span className="text-danger">{errors.descripcion.message}</span>}
                        </Form.Group>

                        <Form.Group controlId="marca">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa la marca"
                                {...register('marca', { required: 'La marca es obligatoria' })}
                            />
                            {errors.marca && <span className="text-danger">{errors.marca.message}</span>}
                        </Form.Group>

                        <Form.Group controlId="cantidad">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa la cantidad"
                                {...register('cantidad', { required: 'La cantidad es obligatoria' })}
                            />
                            {errors.cantidad && <span className="text-danger">{errors.cantidad.message}</span>}
                        </Form.Group>

                        <Form.Group controlId="unidad_medida">
                            <Form.Label>Unidad de Medida</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa la unidad de medida"
                                {...register('unidad_medida', { required: 'La unidad de medida es obligatoria' })}
                            />
                            {errors.unidad_medida && <span className="text-danger">{errors.unidad_medida.message}</span>}
                        </Form.Group>

                        <Form.Group controlId="precio">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa el precio"
                                {...register('precio', { required: 'El precio es obligatorio' })}
                            />
                            {errors.precio && <span className="text-danger">{errors.precio.message}</span>}
                        </Form.Group>

                        <Form.Group controlId="categoria">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa la categoría"
                                {...register('categoria', { required: 'La categoría es obligatoria' })}
                            />
                            {errors.categoria && <span className="text-danger">{errors.categoria.message}</span>}
                        </Form.Group>

                        <Form.Group controlId="tipo">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el tipo"
                                {...register('tipo', { required: 'El tipo es obligatorio' })}
                            />
                            {errors.tipo && <span className="text-danger">{errors.tipo.message}</span>}
                        </Form.Group>

                        {/* Subir imagen */}
                        <Form.Group controlId="imagen">
                            <Form.Label>Imagen (solo PNG)</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".png"
                                {...register('imagen', { required: 'La imagen es obligatoria' })}
                                onChange={handleImageChange}
                            />
                            {errors.imagen && <span className="text-danger">{errors.imagen.message}</span>}
                        </Form.Group>

                        {imagePreview && <img src={imagePreview} alt="Previsualización" width="200" className="mt-3" />}

                        <Button variant="primary" type="submit" className="mt-3">
                            Crear Producto
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CrearProducto;
