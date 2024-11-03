import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import pedidoService from '../../services/pedido.service';
import exportService from '../../services/export.service';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
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

    const handleExportPedidoIndividual = async (pedido) => {
        try {
            // Datos del pedido para exportar
            const pedidoData = {
                "NÚMERO": pedido.id,
                'FECHA DEL PEDIDO': formatDateToDDMMYYYY(pedido.fecha_pedido),
                'ESTADO ACTUAL': pedido.estado,
                'PROVEEDOR': pedido.proveedor?.nombre || 'No disponible',
                'INVENTARIO ASIGNADO': pedido.inventarioAsignado?.nombre || 'No disponible'
            };

            // Productos asociados al pedido
            const productosExport = pedido.pedidoProductos.map(productoPedido => ({
                "NOMBRE DEL PRODUCTO": productoPedido.producto.nombre,
                CANTIDAD: productoPedido.cantidad,
                "UNIDAD DE MEDIDA": productoPedido.producto.unidad_medida,
                PRECIO: productoPedido.producto.precio,
                SUBTOTAL: productoPedido.cantidad * productoPedido.producto.precio
            }));

            // Nombres personalizados para las hojas de Excel
            const sheetNames = {
                mainSheet: "Pedido",
                arraySheet1: "Productos"
            };

            // Llamada al servicio de exportación
            await exportService.exportObjectAndArraysToExcel(pedidoData, [productosExport], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del pedido:', error);
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
                    itemData={pedido} // Pasa el pedido completo
                    onExport={() => handleExportPedidoIndividual(pedido)} // Llama a la función específica de exportación
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
                    <div className="button-container mt-3">
                        {/* Botón Crear Pedido con estilos de Bootstrap y texto en negrita */}
                        <Link to="/crear-pedido" className="button-left">
                            <Button variant="warning" className="btn-create" style={{ fontWeight: 'bold' }}
                            >
                                <FontAwesomeIcon icon={faPlus} /> CREAR PEDIDO
                            </Button>
                        </Link>

                        {/* Botón Exportar a Excel para Pedido con texto en negrita y borde simulado */}
                        <Button
                            variant="success"
                            onClick={handleExport}
                            className="button-right"
                            disabled={!!error} // Desactiva si hay un error
                            style={{
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '1px 1px 1px black, -1px -1px 1px black', // Borde simulado en negro
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

export default Pedidos;
