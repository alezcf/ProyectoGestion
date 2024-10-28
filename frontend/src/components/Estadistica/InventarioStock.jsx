import React, { useEffect, useState } from 'react';
import { getInventarioStock } from '../../services/estadistica.service';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../css/Estadistica/InventarioStock.css'; // Importa el archivo de estilos

// Registrar los componentes necesarios para el gráfico de torta
ChartJS.register(ArcElement, Tooltip, Legend);

const InventarioStock = () => {
    const [data, setData] = useState([]);
    const [selectedInventario, setSelectedInventario] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getInventarioStock();
                setData(result);
                if (result.length > 0) setSelectedInventario(result[0]); // Selecciona el primer inventario por defecto
            } catch (error) {
                console.error('Error al obtener inventarios y stock:', error);
            }
        };

        fetchData();
    }, []);

    const handleSelectChange = (e) => {
        const inventario = data.find(item => item.nombre === e.target.value);
        setSelectedInventario(inventario);
    };

    const chartData = selectedInventario ? {
        labels: ['Stock Actual', 'Stock Faltante'],
        datasets: [
            {
                data: [selectedInventario.stockActual, selectedInventario.maximoStock - selectedInventario.stockActual],
                backgroundColor: ['#BC0D8D', '#CF9C01'],
                hoverBackgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
            },
        ],
    } : null;

    return (
        <div className="inventario-stock-container" style={{ marginTop: '20px' }}>
            <label htmlFor="inventario-select" className="inventario-select-label">Selecciona un inventario:</label>
            <select id="inventario-select" onChange={handleSelectChange} className="inventario-select">
                {data.map((item, index) => (
                    <option key={index} value={item.nombre}>
                        {item.nombre}
                    </option>
                ))}
            </select>

            {selectedInventario && (
                <div style={{ width: 'auto', height: 'auto', marginTop: '30px' }}>
                    <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
            )}
        </div>
    );
};

export default InventarioStock;
