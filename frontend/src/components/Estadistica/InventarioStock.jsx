import React, { useEffect, useState } from 'react';
import { getInventarioStock } from '../../services/estadistica.service';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../../css/Estadistica/InventarioStock.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const InventarioStock = () => {
    const [data, setData] = useState([]);
    const [selectedInventario, setSelectedInventario] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getInventarioStock();
                setData(result);
                if (result.length > 0) setSelectedInventario(result[0]);
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
        <div className="inventario-stock-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div className="inventario-select-container">
                <label htmlFor="inventario-select" className="inventario-select-label">Selecciona un inventario: </label>
                <select id="inventario-select" onChange={handleSelectChange} className="inventario-select">
                    {data.map((item, index) => (
                        <option key={index} value={item.nombre}>
                            {item.nombre}
                        </option>
                    ))}
                </select>
            </div>


            {selectedInventario && (
                <div className="inventario-stock-chart-container">
                    <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                </div>
            )}
        </div>
    );

};

export default InventarioStock;
