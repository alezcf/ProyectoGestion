import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { FileEarmarkExcel, InfoCircle } from 'react-bootstrap-icons';
import productoService from '../services/producto.service'; // Servicio para obtener productos
import '../css/Inventario.css';
import '../css/Buttons.css';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await productoService.getAllProductos(); // Obtener todos los productos
                setProductos(data);
            } catch (err) {
                setError('Error al cargar los productos.');
            }
        };

        fetchProductos();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container fluid className="producto-container mt-2">
            <div className="inventario-header">
                <h1>Productos</h1>
            </div>

            <Row className="justify-content-md-center">
                <Card className="w-100">
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger" className="alert-danger">
                                {error}
                            </Alert>
                        ) : (
                            <>
                                {/* Buscador */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Buscar producto..."
                                        className="form-control"
                                    />
                                </div>

                                {/* Tabla de productos */}
                                <div className="table-responsive">
                                    <Table striped bordered hover responsive="md" className="inventario-table">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Marca</th>
                                                <th>Categoría</th>
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProductos.map((producto, index) => (
                                                <tr key={index}>
                                                    <td>{producto.nombre}</td>
                                                    <td>{producto.marca}</td>
                                                    <td>{producto.categoria}</td>
                                                    <td>${producto.precio}</td>
                                                    <td>{producto.cantidad} {producto.unidad_medida}</td>
                                                    <td>
                                                        <Link 
                                                            to={`/producto/${producto.id}`} // Usamos Link para redirigir
                                                            className="button btn-info"
                                                        >
                                                            <InfoCircle />
                                                        </Link>

                                                        <button 
                                                            type="submit" 
                                                            className="button btn-success"
                                                            onClick={() => handleExportClick(producto.nombre)} // Console log
                                                        >
                                                            <FileEarmarkExcel />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Productos;