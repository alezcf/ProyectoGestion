import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const data = await proveedorService.getAllProveedores();
                setProveedores(data);
                console.log(data);
            } catch (err) {
                setError('Error al cargar los proveedores.');
            }
        };

        fetchProveedores();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = async () => {
        try {
            const proveedoresData = proveedores.map(proveedor => ({
                NOMBRE: proveedor.nombre,
                RUT: proveedor.rut,
                DIRECCIÓN: proveedor.direccion,
                TELÉFONO: proveedor.telefono,
                'CORREO ELECTRÓNICO': proveedor.email
            }));
            console.log('Datos a exportar:', proveedoresData);
            const filePath = await exportService.exportDataToExcel(proveedoresData);
            console.log('Archivo Excel exportado:', filePath);
            alert('Datos exportados con éxito. Archivo disponible en: ' + filePath);
        } catch (error) {
            console.error('Error exportando a Excel:', error);
            alert('Error al exportar los datos.');
        }
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
                    onExport={() => handleExport(proveedor.nombre)} // Exportar datos del proveedor
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
                                {/* Botón para exportar proveedores */}
                                <div className="mt-3">
                                    <Button variant="primary" onClick={handleExport}>Exportar a Excel</Button>
                                </div>
                                {/* Botón para crear nuevo proveedor */}
                                <div className="mt-3">
                                    <Link to="/crear-proveedor">
                                        <Button variant="success">Crear Proveedor</Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Proveedores;
