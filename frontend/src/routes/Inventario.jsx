import React, { useState } from 'react';
import { Container, Row, Card, Alert } from 'react-bootstrap';
import useInventarioData from '../logic/inventario.logic.js'; // Hook para obtener los datos del inventario
import InventarioSelector from '../components/InventarioSelector';
import InventarioDetalles from '../components/InventarioDetalles';
import '../css/Inventario.css'; // Archivo de estilos

const Inventario = () => {
    const { inventarioData, categorias, error } = useInventarioData(); // Hook para obtener los datos
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
                                {/* Componente para seleccionar inventario, categoría y buscar */}
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

                                {/* Detalles del inventario filtrado usando InventarioDetalles */}
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
