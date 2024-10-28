import React, { useEffect, useState } from 'react';
import { getCantidadProductosPorCategoria } from '../../services/estadistica.service';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CantidadProductosPorCategoria = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getCantidadProductosPorCategoria();
            setData(result);
        };
        fetchData();
    }, []);

    const chartData = {
        labels: data.map(item => item.categoria),
        datasets: [
            {
                data: data.map(item => parseInt(item.totalCantidad, 10)),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.9)',   // Rojo
                  'rgba(54, 162, 235, 0.9)',   // Azul
                  'rgba(255, 206, 86, 0.9)',   // Amarillo
                  'rgba(75, 192, 192, 0.9)',   // Verde Agua
                  'rgba(153, 102, 255, 0.9)',  // Violeta
                  'rgba(255, 159, 64, 0.9)',   // Naranja
                  'rgba(105, 105, 105, 0.9)',  // Gris Oscuro
                  'rgba(34, 139, 34, 0.9)',    // Verde Bosque
                  'rgba(218, 165, 32, 0.9)',   // Dorado Oscuro
                  'rgba(0, 128, 128, 0.9)',    // Verde Teal
                  'rgba(0, 0, 139, 0.9)',      // Azul Marino
                  'rgba(128, 0, 128, 0.9)'     // Púrpura
            ],



            },
        ],
    };

    return (
        <div style={{ width: '90%', height: '100%' }}>
            <Doughnut data={chartData} options={{ maintainAspectRatio: true }}/>
        </div>
    );
};

export default CantidadProductosPorCategoria;
