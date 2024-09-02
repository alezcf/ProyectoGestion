import React, { useState } from 'react';
import { Container, Row, Card, Alert } from 'react-bootstrap';
import InventarioLogic from '../logic/inventario.logic.js';
import filterData from '../logic/filterData.logic.js';
import InventarioSelector from '../components/InventarioSelector';
import InventarioDetalles from '../components/InventarioDetalles';
import '../css/Inventario.css';

const Inventario = () => {
    const { inventarioData, categorias, error } = InventarioLogic();
    const [selectedInventario, setSelectedInventario] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [stockRange, setStockRange] = useState([0, 100]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
        setCurrentPage(1);
    };

    const handleStockRangeChange = (value) => {
        setStockRange(value);
    };

    const filteredData = filterData(
        inventarioData.find(inv => inv._id === selectedInventario),
        selectedCategoria,
        searchQuery,
        stockRange
    );

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
                    stockRange={stockRange}
                    handleStockRangeChange={handleStockRangeChange}
                    />
                    {filteredData && (
                    <InventarioDetalles selectedData={filteredData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
