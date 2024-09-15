// src/pages/Inventario/Inventario.js
import React, { useState } from 'react';
import { Container, Row, Card, Alert } from 'react-bootstrap';
import useInventarioData, { filtrarInventario } from '../../logic/inventario.logic';
import InventarioSelector from '../../components/Inventario/InventarioSelector';
import InventarioDetalles from '../../components/Inventario/InventarioDetalles';
import '../../css/Inventario.css';

const Inventario = () => {
    const { inventarioData, categorias, error } = useInventarioData();
    const [selectedInventario, setSelectedInventario] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const filteredData = filtrarInventario(inventarioData, selectedInventario, selectedCategoria);

    return (
        <Container fluid className="inventario-container mt-2">
            <div className="inventario-header">
                <h1>Inventario</h1>
            </div>

            <Row className="justify-content-md-center">
                <Card className="w-100">
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
