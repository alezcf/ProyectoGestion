import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el productoId de la URL
import productoService from '../services/producto.service'; // Servicio para obtener los datos del producto
import { Container, Row, Col, Image, Spinner, Alert, Button } from 'react-bootstrap';

const Producto = () => {
    const { productoId } = useParams(); // Obtener el productoId desde la URL
    const [producto, setProducto] = useState(null); // Estado para los datos del producto
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado para el manejo de errores

    // Llamar al servicio para obtener los datos del producto cuando el componente se monte
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const data = await productoService.getProducto(productoId); // Llamar al servicio
                setProducto(data); // Guardar los datos del producto en el estado
                setLoading(false); // Dejar de mostrar el spinner de carga
            } catch (err) {
                setError('Error al cargar el producto.'); // Manejar errores
                setLoading(false);
            }
        };

        fetchProducto();
    }, [productoId]); // Ejecutar el efecto cada vez que cambie el productoId

    // Mostrar un spinner mientras se cargan los datos
    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando producto...
            </Container>
        );
    }

    // Mostrar un mensaje de error si ocurre un problema
    if (error) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    // Renderizar los datos del producto cuando se cargan correctamente
    return (
        <Container>
            <Row className="my-4">
                <Col md={6}>
                    {producto?.imagen ? (
                        <Image src={producto.imagen} alt={producto.nombre} fluid />
                    ) : (
                        <Image src="https://via.placeholder.com/300x300" alt="Producto sin imagen" fluid />
                    )}
                </Col>
                <Col md={6}>
                    <h2>{producto?.nombre}</h2>
                    <p><strong>Marca:</strong> {producto?.marca}</p>
                    <p><strong>Categoria:</strong> {producto?.categoria}</p>
                    <p><strong>Descripción:</strong> {producto?.descripcion}</p>
                    <h3>${producto?.precio}</h3>
                    <p><strong>Stock disponible:</strong> {producto?.stock}</p>
                    <Button variant="primary" className="mt-3">Agregar al Carrito</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Producto;
