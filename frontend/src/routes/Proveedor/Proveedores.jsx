import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const data = await proveedorService.getAllProveedores();
                setProveedores(data || []);
                setError(null); // Resetea el error si se carga correctamente
            } catch (err) {
                // Asigna el mensaje del backend o un mensaje genérico
                const errorMessage = err.response?.data?.message || 'Error de red. No se pudo conectar con el servidor.';
                setError(errorMessage);
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
            const filePath = await exportService.exportDataToExcel(proveedoresData);
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
                    onExport={() => handleExport(proveedor.nombre)}
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
                    <div className="button-container mt-3">
                        {/* Botón Crear Proveedor con estilos de Bootstrap y texto en negrita */}
                        <Link to="/crear-proveedor">
                            <Button
                                variant="warning"
                                className="btn-create"
                                style={{ fontWeight: 'bold' }}
                            >
                                <FontAwesomeIcon icon={faPlus} /> CREAR PROVEEDOR
                            </Button>
                        </Link>

                        {/* Botón Exportar a Excel para Proveedor con texto en negrita y borde simulado */}
                        <Button
                            variant="success"
                            className="button-right"
                            onClick={handleExport}
                            disabled={!!error} // Desactiva si hay un error
                            style={{
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '1px 1px 1px black, -1px -1px 1px black', // Borde simulado en negro
                            }}
                        >
                            <FontAwesomeIcon icon={faFileExcel} /> EXPORTAR EXCEL
                        </Button>
                    </div>

                </Card>
            </Row>
        </Container>
    );
};

export default Proveedores;
