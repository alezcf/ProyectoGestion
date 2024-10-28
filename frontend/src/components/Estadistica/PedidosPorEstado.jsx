import React, { useEffect, useState } from 'react';
import { getPedidosPorEstado } from '../../services/estadistica.service';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los componentes de chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PedidosPorEstado = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getPedidosPorEstado();
                console.log(result);
                setData(result);
            } catch (error) {
                console.error('Error al obtener pedidos por estado:', error);
            }
        };

        fetchData();
    }, []);

    const chartData = {
        labels: data.map(item => item.pedido_estado),
        datasets: [
            {
                label: 'Cantidad de Pedidos',
                data: data.map(item => parseInt(item.count, 10)),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                ticks: {
                    stepSize: 1, // Configura el incremento en 1 para que solo muestre números enteros
                    beginAtZero: true,
                    precision: 0, // Asegura que solo se muestren números enteros
                    maintainAspectRatio: true,
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: 'auto' }}>
            <Bar data={chartData} options={options}  />
        </div>
    );
};

export default PedidosPorEstado;
