import React from 'react';
import InventarioStock from './InventarioStock';
import PedidosPorProveedor from './PedidosPorProveedor';
import CantidadProductosPorCategoria from './CantidadProductosPorCategoria';
import '../../css/Estadistica/InventarioStock.css'; // Reutilizamos el CSS de InventarioStock

const EstadisticasDashboard = () => {
    return (
        <div className="estadisticas-dashboard">
            {/* Pedidos por Estado */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Pedidos por Proveedor</h3>
                <PedidosPorProveedor />
            </div>

            {/* Inventario y Stock */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Stock por inventario</h3>
                <InventarioStock />
            </div>

            <div className="dashboard-card">
            <h3 className="dashboard-card-title">Productos totales por categoría</h3>
                <CantidadProductosPorCategoria />
            </div>
        </div>
    );
};

export default EstadisticasDashboard;
