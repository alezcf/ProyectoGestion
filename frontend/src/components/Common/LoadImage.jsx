import React, { useState } from 'react';
import { Image, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import productoService from '../../services/producto.service'; // Servicio para actualizar el producto

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductoImagen = ({ productoId, imagenRuta, onImagenUpdated }) => {
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [previewImagen, setPreviewImagen] = useState(imagenRuta ? `${BASE_URL}${imagenRuta}` : '../images/NoExiste.png');
    const [cargando, setCargando] = useState(false);

    // Función para manejar la selección de la nueva imagen
    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNuevaImagen(file);
            setPreviewImagen(URL.createObjectURL(file)); // Muestra la nueva imagen en la vista previa
        }
    };

    // Función para enviar la nueva imagen al backend y actualizar el producto
    const handleReemplazarImagen = async () => {
        if (!nuevaImagen) return; // Si no hay nueva imagen seleccionada, no hacer nada

        setCargando(true);
        try {
            // Actualizar el producto con la nueva imagen usando el servicio
            const updatedProducto = await productoService.updateProductoImagen(productoId, nuevaImagen);
            console.log(`${BASE_URL}${imagenRuta}`);
            console.log(updatedProducto);
            // Notificar al componente padre que la imagen ha sido actualizada
            if (onImagenUpdated) {
                onImagenUpdated(updatedProducto.imagen_ruta);
            }

            alert('Imagen reemplazada exitosamente');
        } catch (error) {
            console.error('Error al reemplazar la imagen:', error);
            alert('Error al reemplazar la imagen');
        } finally {
            setCargando(false);
        }
    };

    return (
<div className="producto-imagen-container">
    <Image
        src={previewImagen}
        fluid
        style={{
            objectFit: 'cover',
            width: '100%',
            maxHeight: '400px',
            borderRadius: '10px',
            marginBottom: '15px',
        }}
    />
    <Form.Group controlId="formFile" className="mb-3">
        <Form.Control type="file" accept="image/*" onChange={handleImagenChange} />
    </Form.Group>
    <Button
        variant="primary"
        disabled={!nuevaImagen || cargando}
        onClick={handleReemplazarImagen}
        className="btn-replace-inside"
    > <FontAwesomeIcon icon={faImage} />  {cargando ? 'Reemplazando...' : 'Guardar'}
    </Button>
</div>
    );
};

ProductoImagen.propTypes = {
    productoId: PropTypes.string.isRequired, // ID del producto a actualizar
    imagenRuta: PropTypes.string, // Ruta de la imagen actual
    onImagenUpdated: PropTypes.func, // Callback para notificar al componente padre que la imagen ha sido actualizada
};

export default ProductoImagen;
