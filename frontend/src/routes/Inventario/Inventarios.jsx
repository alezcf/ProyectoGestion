import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import inventarioService from '../../services/inventario.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import CustomTable from '../../components/Common/CustomTable';
import InventarioAcciones from '../../components/Inventario/InventarioAcciones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
                console.log(data);
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

    // Implementar la lógica de exportación
    const handleExport = async () => {
        try {
            const inventarioDataToExport = filteredData.map(inventario => ({
                NOMBRE: inventario.nombre,
                'MÁXIMO STOCK': inventario.maximo_stock,
                'ÚLTIMA ACTUALIZACIÓN': formatDateToDDMMYYYY(inventario.ultima_actualizacion),
            }));
            console.log('Datos a exportar:', inventarioDataToExport);
            const filePath = await exportService.exportDataToExcel(inventarioDataToExport);
            console.log('Archivo Excel exportado:', filePath);
            alert('Datos exportados con éxito. Archivo disponible en: ' + filePath);
        } catch (error) {
            console.error('Error exportando a Excel:', error);
            alert('Error al exportar los datos.');
        }
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
                            </>
                        )}
                    </Card.Body>

                    <div className="button-container">
    <Link to="/crear-inventario" className="button-left">
        <Button className="me-2" variant="primary">
            <FontAwesomeIcon icon={faPlus} /> Crear Inventario
        </Button>
    </Link>

    {/* Botón para exportar a Excel */}
    <Button className="button-right" variant="primary" onClick={handleExport}>
        Exportar a Excel
    </Button>
</div>

                </Card>
            </Row>
        </Container>
    );
};

export default Inventario;
