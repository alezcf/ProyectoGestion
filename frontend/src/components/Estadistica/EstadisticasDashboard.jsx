import React from 'react';
import InventarioStock from './InventarioStock';
import PedidosPorProveedor from './PedidosPorProveedor';
import CantidadProductosPorCategoria from './CantidadProductosPorCategoria';
import TendenciaReposicion from './TendenciaReposicionPorCategoria';
import '../../css/Estadistica/InventarioStock.css';

const EstadisticasDashboard = () => {
    return (
        <div className="estadisticas-dashboard tendencia-reposicion">

                        {/* Productos por Categoría */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Productos por categoría</h3>
                <CantidadProductosPorCategoria />
            </div>

            {/* Inventario y Stock */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Stock por inventario</h3>
                <InventarioStock />
            </div>

                        {/* Pedidos por Proveedor */}
                        <div className="dashboard-card">
                <h3 className="dashboard-card-title">Productos por Proveedor</h3>
                <PedidosPorProveedor />
            </div>
            {/* Tendencia de Reposición */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title">Productos adquiridos</h3>
                <TendenciaReposicion />
            </div>
        </div>
    );
};

export default EstadisticasDashboard;
