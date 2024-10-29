import React from 'react';
import InventarioStock from './InventarioStock';
import PedidosPorProveedor from './PedidosPorProveedor';
import CantidadProductosPorCategoria from './CantidadProductosPorCategoria';
import TendenciaReposicion from './TendenciaReposicionPorCategoria';
import '../../css/Estadistica/InventarioStock.css';

const EstadisticasDashboard = () => {
    return (
        <div className="estadisticas-dashboard tendencia-reposicion">
            {/* Pedidos por Proveedor */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Productos por Proveedor</h3>
                <PedidosPorProveedor />
            </div>

            {/* Inventario y Stock */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Stock por inventario</h3>
                <InventarioStock />
            </div>

            {/* Productos por Categoría */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Productos totales por categoría</h3>
                <CantidadProductosPorCategoria />
            </div>

            {/* Tendencia de Reposición */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Productos totales</h3>
                <TendenciaReposicion />
            </div>
        </div>
    );
};

export default EstadisticasDashboard;
