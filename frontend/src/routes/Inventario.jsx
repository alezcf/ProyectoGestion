import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert } from 'react-bootstrap';
import useInventarioData from '../logic/inventario.logic.js'; // Hook para obtener los datos del inventario
import InventarioSelector from '../components/InventarioSelector';
import InventarioDetalles from '../components/InventarioDetalles';
import '../css/Inventario.css';

const Inventario = () => {
    const { inventarioData, categorias, error } = useInventarioData(); // Datos desde el hook
    const [selectedInventario, setSelectedInventario] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    // Filtramos los datos del inventario seleccionado
    const selectedData = inventarioData.find(inv => inv.id === parseInt(selectedInventario));

    // Filtramos los productos según la categoría seleccionada
    const filteredData = selectedData
        ? {
            ...selectedData,
            productoInventarios: selectedCategoria
                ? selectedData.productoInventarios.filter(productoInventario =>
                    productoInventario.producto.categoria === selectedCategoria
                )
                : selectedData.productoInventarios
        }
        : null;

    return (
        <Container fluid className="inventario-container">
            <Row className="justify-content-md-center">
                <Card className="inventario-card">
                    <Card.Header as="h1" className="inventario-header">Inventario</Card.Header>
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger" className="text-center">
                                Error: {error}
                            </Alert>
                        ) : (
                            <>
                                <InventarioSelector
                                    inventarioData={inventarioData}
                                    selectedInventario={selectedInventario}
                                    handleSelectChange={handleInputChange(setSelectedInventario)}
                                    categorias={categorias}
                                    selectedCategoria={selectedCategoria}
                                    handleCategoriaChange={handleInputChange(setSelectedCategoria)}
                                    searchQuery={searchQuery}
                                    handleSearchChange={handleInputChange(setSearchQuery)}
                                />
                                {filteredData && filteredData.productoInventarios.length > 0 ? (
                                    <InventarioDetalles selectedData={filteredData} />
                                ) : (
                                    <p>No hay productos disponibles para esta categoría.</p>
                                )}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Inventario;
