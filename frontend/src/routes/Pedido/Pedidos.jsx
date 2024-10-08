import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import pedidoService from '../../services/pedido.service';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';
import { Link } from 'react-router-dom';
import CustomTable from '../../components/Common/CustomTable';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await pedidoService.getAllPedidos();
                setPedidos(response); // Accedemos a la clave 'data' de la respuesta
            } catch (err) {
                setError('Error al cargar los pedidos.');
            }
        };

        fetchPedidos();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = (pedidoId) => {
        console.log(`Exportar datos del pedido: ${pedidoId}`);
        // Aquí puedes implementar la lógica para exportar los datos (CSV, PDF, etc.)
    };

    // Función para sumar las cantidades de productos en cada pedido
    const calcularCantidadTotalProductos = (pedidoProductos) => {
        return pedidoProductos.reduce((total, producto) => total + parseInt(producto.cantidad, 10), 0);
    };

    // Función para calcular el costo total de cada pedido (cantidad * precio por cada producto)
    const calcularCostoTotal = (pedidoProductos) => {
        return pedidoProductos.reduce((total, producto) =>
            total + parseInt(producto.cantidad, 10) * parseInt(producto.producto.precio, 10), 0
        );
    };

    // Filtrar los pedidos basados en la búsqueda por nombre del proveedor
    const filteredPedidos = pedidos.filter((pedido) =>
        pedido.proveedor.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = ['ID', 'Fecha de Pedido', 'Estado', 'Cantidad de Productos', 'Costo', 'Proveedor', 'Inventario Asignado', 'Acciones'];

    const renderRow = (pedido, index) => (
        <tr key={index}>
            <td>{pedido.id}</td>
            <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
            <td>{pedido.estado}</td>
            <td>{calcularCantidadTotalProductos(pedido.pedidoProductos)}</td>
            <td>${calcularCostoTotal(pedido.pedidoProductos)}</td>
            <td>{pedido.proveedor.nombre}</td>
            <td>{pedido.inventarioAsignado.nombre}</td>
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
            <div className="pedido-header">
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
                <Link to="/crear-pedido">
                    <Button variant="success">Crear Pedido</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Pedidos;