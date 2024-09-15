// src/pages/Productos/Productos.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert } from 'react-bootstrap';
import productoService from '../../services/producto.service';
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import ProductoAcciones from '../../components/Producto/ProductoAcciones';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await productoService.getAllProductos();
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

    const handleExport = (productoNombre) => {
        console.log(`Exportar datos del producto: ${productoNombre}`);
        // Aquí puedes implementar la lógica para exportar los datos (CSV, PDF, etc.)
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = ['Nombre', 'Marca', 'Categoría', 'Precio', 'Cantidad', 'Acciones'];

    const renderRow = (producto, index) => (
        <tr key={index}>
            <td>{producto.nombre}</td>
            <td>{producto.marca}</td>
            <td>{producto.categoria}</td>
            <td>${producto.precio}</td>
            <td>{producto.cantidad} {producto.unidad_medida}</td>
            <td>
                <ProductoAcciones
                    productoId={producto.id}
                    productoNombre={producto.nombre}
                    onExport={handleExport}
                />
            </td>
        </tr>
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
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                <SearchBar
                                    searchQuery={searchQuery}
                                    handleSearchChange={handleSearchChange}
                                />
                                <CustomTable
                                    headers={headers}
                                    data={filteredProductos}
                                    renderRow={renderRow}
                                />
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Productos;
