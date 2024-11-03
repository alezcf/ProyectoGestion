import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import inventarioService from '../../services/inventario.service';
import exportService from '../../services/export.service';
import CustomTable from '../../components/Common/CustomTable';
import InventarioAcciones from '../../components/Inventario/InventarioAcciones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic';
import '../../css/Inventario.css';

const Inventario = () => {
    const [inventarioData, setInventarioData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventarios = async () => {
            try {
                const data = await inventarioService.getAllInventarios();

                // Agregar la propiedad stock_actual sumando las cantidades de productoInventarios
                const dataWithStockActual = data.map(inventario => ({
                    ...inventario,
                    stock_actual: inventario.productoInventarios.reduce((total, item) => total + item.cantidad, 0)
                }));

                setInventarioData(dataWithStockActual);
                setFilteredData(dataWithStockActual);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('No se encontraron inventarios registrados.');
                } else {
                    setError('Error al cargar los inventarios.');
                }
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

    const handleExport = async () => {
        try {
            const inventarioDataToExport = filteredData.map(inventario => ({
                NOMBRE: inventario.nombre,
                'STOCK ACTUAL': inventario.stock_actual,
                'MÁXIMO STOCK': inventario.maximo_stock,
                'ÚLTIMA ACTUALIZACIÓN': formatDateToDDMMYYYY(inventario.ultima_actualizacion),
            }));
            const filePath = await exportService.exportDataToExcel(inventarioDataToExport);
            alert('Datos exportados con éxito. Archivo disponible en: ' + filePath);
        } catch (error) {
            console.error('Error exportando a Excel:', error);
            alert('Error al exportar los datos.');
        }
    };

    const handleExportInventarioIndividual = async (inventario) => {
        try {
            const inventarioData = {
                NOMBRE: inventario.nombre,
                'STOCK ACTUAL': inventario.stock_actual,
                'MÁXIMO STOCK': inventario.maximo_stock,
                'ÚLTIMA ACTUALIZACIÓN': formatDateToDDMMYYYY(inventario.ultima_actualizacion),
            };

            const productosExport = inventario.productoInventarios.map(productoInventario => ({
                "NOMBRE DEL PRODUCTO": productoInventario.producto.nombre,
                MARCA: productoInventario.producto.marca,
                DESCRIPCIÓN: productoInventario.producto.descripcion,
                CATEGORÍA: productoInventario.producto.categoria,
                TIPO: productoInventario.producto.tipo,
                CANTIDAD: productoInventario.cantidad
            }));

            const sheetNames = {
                mainSheet: "Inventario",
                arraySheet1: "Productos"
            };

            await exportService.exportObjectAndArraysToExcel(inventarioData, [productosExport], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del inventario:', error);
            alert('Error al exportar los datos.');
        }
    };

    const headers = ['Nombre', "Stock actual", 'Máximo Stock', 'Última Actualización', 'Acciones'];

    const renderRow = (inventario, index) => (
        <tr key={index}>
            <td>{inventario.nombre}</td>
            <td>{inventario.stock_actual}</td> {/* Mostrar stock actual calculado */}
            <td>{inventario.maximo_stock}</td>
            <td>{formatDateToDDMMYYYY(inventario.ultima_actualizacion)}</td>
            <td>
                <InventarioAcciones
                    inventarioId={inventario.id}
                    inventario={inventario}
                    onExport={() => handleExportInventarioIndividual(inventario)}
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
                                {filteredData.length > 0 ? (
                                    <CustomTable
                                        headers={headers}
                                        data={filteredData}
                                        renderRow={renderRow}
                                    />
                                ) : (
                                    <div className="text-center mt-4 mb-4">
                                        No existen inventarios registrados.
                                    </div>
                                )}
                            </>
                        )}
                    </Card.Body>

                    <div className="button-container mt-3">
                        <Link to="/crear-inventario" className="button-left">
                            <Button variant="warning" className="btn-create" style={{ fontWeight: 'bold' }}>
                                <FontAwesomeIcon icon={faPlus} /> CREAR INVENTARIO
                            </Button>
                        </Link>

                        <Button
                            className="button-right"
                            variant="success"
                            onClick={handleExport}
                            disabled={!!error}
                            style={{
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '1px 1px 1px black, -1px -1px 1px black',
                            }}
                        >
                            <FontAwesomeIcon icon={faFileExcel} /> EXPORTAR A EXCEL
                        </Button>
                    </div>
                </Card>
            </Row>
        </Container>
    );
};

export default Inventario;
