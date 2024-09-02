import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../css/InventarioSelector.css'; 

const InventarioSelector = ({ inventarioData, selectedInventario, handleSelectChange, categorias, selectedCategoria, handleCategoriaChange, searchQuery, handleSearchChange, resetPage }) => {
    const handleInventarioChange = (event) => {
        handleSelectChange(event);
        resetPage();
    };

    const handleCategoriaChangeInternal = (event) => {
        handleCategoriaChange(event);
        resetPage();
    };

    const handleSearchChangeInternal = (event) => {
        handleSearchChange(event);
        resetPage();
    };

    return (
        <>
            <Form.Group controlId="inventarioSelect" className="mb-4 selector-group">
                <Form.Control 
                    as="select" 
                    value={selectedInventario} 
                    onChange={handleInventarioChange} 
                    className="selector-control"
                    style={{ textAlign: 'center' }}
                >
                    <option value="" style={{ textAlign: 'center' }}>Selecciona un Inventario</option>
                    {inventarioData.map((inventario) => (
                        <option key={inventario._id} value={inventario._id} className="selector-option">
                            {inventario.nombre}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Row>
                <Col>
                    <Form.Group controlId="categoriaSelect" className="mb-4 selector-group">
                        <Form.Control 
                            as="select" 
                            value={selectedCategoria} 
                            onChange={handleCategoriaChangeInternal} 
                            className="selector-control"
                            style={{ textAlign: 'center' }}
                        >
                            <option value="" style={{ textAlign: 'center' }}>Selecciona una Categoría</option>
                            {categorias.map((categoria, index) => (
                                <option key={index} value={categoria} className="selector-option">
                                    {categoria}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="searchInput" className="mb-4 selector-group">
                        <Form.Control 
                            type="text" 
                            value={searchQuery} 
                            onChange={handleSearchChangeInternal} 
                            placeholder="Buscar..." 
                            className="selector-control"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};

InventarioSelector.propTypes = {
    inventarioData: PropTypes.array.isRequired,
    selectedInventario: PropTypes.string.isRequired,
    handleSelectChange: PropTypes.func.isRequired,
    categorias: PropTypes.array.isRequired,
    selectedCategoria: PropTypes.string.isRequired,
    handleCategoriaChange: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    resetPage: PropTypes.func.isRequired,
};

export default InventarioSelector;
