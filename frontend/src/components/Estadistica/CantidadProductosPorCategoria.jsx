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
                    '#BC0D8D',       // Morado Oscuro Intenso
                    'rgba(21, 136, 125, 1)',    // Verde Azulado Oscuro
                    'rgba(182, 131, 0, 1)',     // Dorado Intenso
                    'rgba(154, 0, 96, 1)',      // Fucsia Oscuro
                    'rgba(220, 40, 40, 1)',     // Rojo Carmesí
                    'rgba(0, 44, 143, 1)',      // Azul Oscuro Eléctrico
                    'rgba(234, 150, 0, 1)',     // Amarillo Naranja
                    'rgba(34, 115, 60, 1)',     // Verde Bosque
                    'rgba(85, 0, 102, 1)',  // Púrpura Oscuro
                    'rgba(179, 58, 0, 1)',      // Naranja Profundo
                    'rgba(0, 112, 112, 1)',     // Turquesa Oscuro
                    'rgba(97, 72, 167, 1)'      // Violeta Real
                ]
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Doughnut data={chartData} options={{ maintainAspectRatio: true }}/>
    </div>
    );
};

export default CantidadProductosPorCategoria;
