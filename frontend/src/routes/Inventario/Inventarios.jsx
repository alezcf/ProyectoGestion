// src/pages/Inventario/Inventario.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import inventarioService from '../../services/inventario.service';
import CustomTable from '../../components/Common/CustomTable';
import InventarioAcciones from '../../components/Inventario/InventarioAcciones';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic'; // Importamos la función de formateo
import '../../css/Inventario.css';

const Inventario = () => {
    const [inventarioData, setInventarioData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventarios = async () => {
            try {
                const data = await inventarioService.getAllInventarios(); // Obtener todos los inventarios
                setInventarioData(data);
                setFilteredData(data);
            } catch (err) {
                setError('Error al cargar los inventarios.');
            }
        };
        fetchInventarios();
    }, []);

    useEffect(() => {
        setFilteredData(
            inventarioData.filter((inventario) =>
                inventario.nombre.toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [filter, inventarioData]);

    const handleExport = (inventarioNombre) => {
        console.log(`Exportar datos del inventario: ${inventarioNombre}`);
        // Implementa la lógica para exportar los datos (CSV, PDF, etc.)
    };

    const headers = ['Nombre', 'Máximo Stock', 'Última Actualización', 'Acciones'];

    const renderRow = (inventario, index) => (
        <tr key={index}>
            <td>{inventario.nombre}</td>
            <td>{inventario.maximo_stock}</td>
            <td>{formatDateToDDMMYYYY(inventario.ultima_actualizacion)}</td> {/* Formatear la fecha */}
            <td>
                <InventarioAcciones
                    inventarioId={inventario.id}
                    inventarioNombre={inventario.nombre}
                    onExport={handleExport}
                />
            </td>
        </tr>
    );

    return (
        <Container fluid className="inventario-container mt-2">
            <div className="inventario-header">
                <h1>Inventarios</h1>
            </div>

            <Row className="justify-content-md-center">
                <Card className="w-100">
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger" className="text-center">
                                {error}
                            </Alert>
                        ) : (
                            <>
                                <Form.Group controlId="filter" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre del inventario"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    />
                                </Form.Group>
                                <CustomTable
                                    headers={headers}
                                    data={filteredData}
                                    renderRow={renderRow}
                                />
                                <div className="mt-3">
                                    <Link to="/crear-inventario">
                                        <Button variant="primary" className="me-2">Crear Inventario</Button>
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

export default Inventario;
