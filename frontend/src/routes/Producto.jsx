import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para redireccionar a la página de edición
import productoService from '../services/producto.service';
import { Container, Row, Col, Spinner, Alert, Image, Table, Button } from 'react-bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Producto = () => {
    const { productoId } = useParams(); // Obtener el productoId desde la URL
    const [producto, setProducto] = useState(null); // Estado para los datos del producto
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado para el manejo de errores
    const navigate = useNavigate(); // Para redireccionar a otra ruta

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

    // Función para manejar la exportación de datos (simulada)
    const handleExport = () => {
        // Aquí podrías implementar la lógica para exportar los datos en formato CSV o PDF
        console.log("Exportar los datos del producto");
        alert("Datos exportados exitosamente");
    };

    // Redirigir al usuario a la página de edición
    const handleEdit = () => {
        navigate(`/editar-producto/${productoId}`);
    };

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
                <Col md={4} className="d-flex flex-column align-items-center">
                    {/* Imagen del producto con estilo */}
                    <Image 
                        src={producto?.imagen_ruta ? `${BASE_URL}${producto.imagen_ruta}` : '../images/NoExiste.png'} 
                        fluid
                        style={{ 
                            objectFit: 'cover', 
                            width: '100%',
                            maxHeight: '500px',
                            borderRadius: '10px', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
                        }} 
                    />

                    {/* Botones debajo de la imagen */}
                    <div className="mt-4 d-flex justify-content-center">
                        <Button variant="primary" onClick={handleEdit} className="me-2">
                            Editar
                        </Button>
                        <Button variant="success" onClick={handleExport}>
                            Exportar
                        </Button>
                    </div>
                </Col>
                <Col md={8}>
                    <div>
                        {/* Ajuste de estilos en los textos */}
                        <h3 style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '24px' }}>
                            {producto?.marca}
                        </h3>
                        <p style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>
                            {producto?.nombre}
                        </p>
                        <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '20px' }}>
                            <strong>Código:</strong> {producto?.codigo} &nbsp; | &nbsp; 
                            <strong>Categoría:</strong> {producto?.categoria}
                        </p>
                        <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                            <strong>Precio:</strong> ${producto?.precio}
                        </h3>
                    </div>

                    {/* Tabla de Características Generales debajo de los atributos */}
                    <div className="mt-4">
                        <h4 style={{ fontSize: '22px', marginBottom: '15px' }}>Características Generales</h4>
                        <Table striped bordered hover responsive style={{ textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th style={{ width: '40%' }}>Características</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Descripción</td>
                                    <td>{producto?.descripcion || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Categoría</td>
                                    <td>{producto?.categoria || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Tipo</td>
                                    <td>{producto?.tipo || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Cantidad</td>
                                    <td>{producto?.cantidad + ' ' + producto?.unidad_medida || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Unidad de medida</td>
                                    <td>{producto?.unidad_medida?.toUpperCase() || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Producto;
