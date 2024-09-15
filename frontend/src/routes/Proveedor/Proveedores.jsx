// src/pages/Proveedores/Proveedores.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert } from 'react-bootstrap';
import proveedorService from '../../services/proveedor.service';
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable'; // Importamos el componente ButtonsActions

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const data = await proveedorService.getAllProveedores();
                setProveedores(data);
            } catch (err) {
                setError('Error al cargar los proveedores.');
            }
        };

        fetchProveedores();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = (proveedorNombre) => {
        console.log(`Exportando datos del proveedor: ${proveedorNombre}`);
        // Aquí puedes implementar la lógica de exportación
    };

    const filteredProveedores = proveedores.filter((proveedor) =>
        proveedor.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = ['Nombre', 'RUT', 'Dirección', 'Teléfono', 'Email', 'Acciones'];

    const renderRow = (proveedor, index) => (
        <tr key={index}>
            <td>{proveedor.nombre}</td>
            <td>{proveedor.rut}</td>
            <td>{proveedor.direccion}</td>
            <td>{proveedor.telefono}</td>
            <td>{proveedor.email}</td>
            <td>
                <ButtonsActionsTable
                    itemId={proveedor.id} 
                    itemName={proveedor.nombre}
                    onExport={handleExport}
                    detailsRoute="/proveedor"
                />
            </td>
        </tr>
    );

    return (
        <Container fluid className="proveedores-container mt-2">
            <div className="inventario-header">
                <h1>Proveedores</h1>
            </div>
            <Row className="justify-content-md-center">
                <Card className="w-100">
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
                                <CustomTable headers={headers} data={filteredProveedores} renderRow={renderRow} />
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Proveedores;
