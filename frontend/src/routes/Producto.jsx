import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Alert } from 'react-bootstrap';
import productoService from '../services/producto.service';
import ProductoImagen from '../components/ProductoImagen';
import ProductoDetalle from '../components/ProductoDetalle';
import '../css/ProductoDetalles.css';

const BASE_URL = import.meta.env.VITE_BASE_URL.replace('/api', '');

const Producto = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const data = await productoService.getProducto(id);
                console.log("Data recibida por producto = ", data);
                setProducto(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchProducto();
    }, [id]);

    if (error) {
        return <Alert variant="danger" className="text-center">Error: {error}</Alert>;
    }

    if (!producto) {
        return <div>Loading...</div>;
    }

    const imageUrl = producto.imagen.replace('src', '');

    return (
        <Container>
            <Card.Body className="producto-detalles-body">
                <Row>
                    <ProductoImagen imageUrl={imageUrl} producto={producto} BASE_URL={BASE_URL} />
                    <ProductoDetalle producto={producto} />
                </Row>
            </Card.Body>
        </Container>
    );
};

export default Producto;
