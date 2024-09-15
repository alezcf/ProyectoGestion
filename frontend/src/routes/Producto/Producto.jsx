// src/pages/Producto/Producto.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productoService from '../../services/producto.service';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductoImagen from '../../components/Producto/ProductoImagen';
import ProductoDetalles from '../../components/Producto/ProductoDetalles';
import ProductoCaracteristicas from '../../components/Producto/ProductoCaracteristicas';
import ProductoBotones from '../../components/Common/ButtonsActions'; // Importamos el nuevo componente

const Producto = () => {
    const { productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const data = await productoService.getProducto(productoId);
                setProducto(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el producto.');
                setLoading(false);
            }
        };

        fetchProducto();
    }, [productoId]);

    const handleEdit = () => {
        console.log("Editar los datos del producto");
    };

    const handleExport = () => {
        console.log("Exportar los datos del producto");
        // Implementar lógica de exportación aquí (e.g., exportar como CSV o PDF)
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando producto...
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="my-4">
                <Col md={4}>
                    <ProductoImagen imagenRuta={producto?.imagen_ruta} />
                    <ProductoBotones onEdit={handleEdit} onExport={handleExport} /> {/* Aquí usamos el nuevo componente */}
                </Col>
                <Col md={8}>
                    <ProductoDetalles producto={producto} />
                    <ProductoCaracteristicas producto={producto} />
                </Col>
            </Row>
        </Container>
    );
};

export default Producto;
