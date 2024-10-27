import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import pedidoService from '../../services/pedido.service';
import exportService from '../../services/export.service';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '../../components/Common/CustomTable';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await pedidoService.getAllPedidos();
                console.log("Obtenido del backend" + response);
                setPedidos(response || []);
            } catch (err) {
                console.log("Obtenido del backend" + err.message);
                const errorMessage = err.message || 'Error de red. No se pudo conectar con el servidor.';
                setError(errorMessage);
                setPedidos([]);
            }
        };

        fetchPedidos();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = async () => {
        try {
            const pedidosData = pedidos.map(pedido => ({
                NÚMERO: pedido.id,
                'FECHA DEL PEDIDO': formatDateToDDMMYYYY(pedido.fecha_pedido),
                ESTADO: pedido.estado,
                'CANTIDAD DE PRODUCTOS': calcularCantidadTotalProductos(pedido.pedidoProductos),
                'COSTO TOTAL': `$${calcularCostoTotal(pedido.pedidoProductos)}`,
                'PROVEEDOR': pedido.proveedor?.nombre,
                'INVENTARIO': pedido.inventarioAsignado?.nombre
            }));
            const filePath = await exportService.exportDataToExcel(pedidosData);
            alert('Datos exportados con éxito. Archivo disponible en: ' + filePath);
        } catch (error) {
            console.error('Error exportando a Excel:', error);
            alert('Error al exportar los datos.');
        }
    };

    const calcularCantidadTotalProductos = (pedidoProductos) => {
        return pedidoProductos.reduce((total, producto) => total + parseInt(producto.cantidad, 10), 0);
    };

    const calcularCostoTotal = (pedidoProductos) => {
        return pedidoProductos.reduce((total, producto) =>
            total + parseInt(producto.cantidad, 10) * parseInt(producto.producto.precio, 10), 0
        );
    };

    const filteredPedidos = pedidos.filter((pedido) =>
        pedido.proveedor?.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = ['Número', 'Fecha', 'Estado', 'Cantidad de Productos', 'Costo', 'Proveedor', 'Inventario Asignado', 'Acciones'];

    const renderRow = (pedido, index) => (
        <tr key={index}>
            <td>{pedido.id}</td>
            <td>{formatDateToDDMMYYYY(pedido.fecha_pedido)}</td>
            <td>{pedido.estado}</td>
            <td>{calcularCantidadTotalProductos(pedido.pedidoProductos)}</td>
            <td>${calcularCostoTotal(pedido.pedidoProductos)}</td>
            <td>{pedido.proveedor?.nombre || 'No disponible'}</td>
            <td>{pedido.inventarioAsignado?.nombre || 'No disponible'}</td>
            <td>
                <ButtonsActionsTable
                    itemId={pedido.id}
                    itemName={pedido.id}
                    onExport={handleExport}
                    detailsRoute="/pedido"
                />
            </td>
        </tr>
    );

    return (
        <Container fluid className="pedido-container mt-2">
            <div className="inventario-header">
                <h1>Pedidos</h1>
            </div>
            <Row className="justify-content-md-center">
                <Card className="w-100">
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                <SearchBar
                                    searchQuery={searchQuery}
                                    handleSearchChange={handleSearchChange}
                                />
                                <CustomTable
                                    headers={headers}
                                    data={filteredPedidos}
                                    renderRow={renderRow}
                                />
                            </>
                        )}
                    </Card.Body>
                    <div className="button-container">
                        <Link to="/crear-pedido" className="button-left">
                            <Button variant="success">
                                <FontAwesomeIcon icon={faPlus} /> Crear Pedido
                            </Button>
                        </Link>

                        <Button
                            variant="primary"
                            onClick={handleExport}
                            className="button-right"
                            disabled={!!error} // Desactiva si hay un error
                        >
                            Exportar a Excel
                        </Button>
                    </div>
                </Card>
            </Row>
        </Container>
    );
};

export default Pedidos;
