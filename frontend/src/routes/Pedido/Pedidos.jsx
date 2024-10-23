import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import pedidoService from '../../services/pedido.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';
import { Link } from 'react-router-dom';
import CustomTable from '../../components/Common/CustomTable';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic'; // Importamos las funciones desde logic

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await pedidoService.getAllPedidos();
                setPedidos(response);
                console.log(response);
            } catch (err) {
                setError('Error al cargar los pedidos.');
            }
        };

        fetchPedidos();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = async () => {
        try {
            // Preparamos los datos para exportar
            const pedidosData = pedidos.map(pedido => ({
                NÚMERO: pedido.id,
                'FECHA DEL PEDIDO': formatDateToDDMMYYYY(pedido.fecha_pedido),
                ESTADO: pedido.estado,
                'CANTIDAD DE PRODUCTOS': calcularCantidadTotalProductos(pedido.pedidoProductos),
                'COSTO TOTAL': `$${calcularCostoTotal(pedido.pedidoProductos)}`,
                'PROVEEDOR': pedido.proveedor.nombre,
                'INVENTARIO': pedido.inventarioAsignado.nombre
            }));

            // Llamamos al servicio de exportación
            const filePath = await exportService.exportDataToExcel(pedidosData);
            console.log('Archivo Excel exportado:', filePath);
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
        pedido.proveedor.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = ['Número', 'Fecha', 'Estado', 'Cantidad de Productos', 'Costo', 'Proveedor', 'Inventario Asignado', 'Acciones'];

    const renderRow = (pedido, index) => (
        <tr key={index}>
            <td>{pedido.id}</td>
            <td>{formatDateToDDMMYYYY(pedido.fecha_pedido)}</td> {/* Usamos la función de formateo */}
            <td>{pedido.estado}</td>
            <td>{calcularCantidadTotalProductos(pedido.pedidoProductos)}</td>
            <td>${calcularCostoTotal(pedido.pedidoProductos)}</td>
            <td>{pedido.proveedor.nombre}</td>
            <td>{pedido.inventarioAsignado.nombre}</td>
            <td>
                <ButtonsActionsTable
                    itemId={pedido.id}
                    itemName={pedido.id}
                    onExport={handleExport}  // Asignamos la función de exportación
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
                </Card>
            </Row>
            <div className="mt-3">
                <Button variant="primary" onClick={handleExport}>Exportar a Excel</Button>
            </div>
            <div className="mt-3">
                <Link to="/crear-pedido">
                    <Button variant="success">Crear Pedido</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Pedidos;
