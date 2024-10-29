import React, { useEffect, useState } from 'react';
import { getPedidosPorProveedor } from '../../services/estadistica.service';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const PedidosPorProveedor = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getPedidosPorProveedor();
                setData(result);
            } catch (error) {
                console.error('Error al obtener pedidos por proveedor:', error);
            }
        };

        fetchData();
    }, []);

    const volumes = data.map(item => parseInt(item.volumenProductos, 10));

    const chartData = {
        labels: data.map(item => item.proveedor),
        datasets: [
            {
                label: 'Volumen de Productos',
                data: volumes,
                backgroundColor: 'black',
                borderColor: volumes.map((_, i) => i === 0 || volumes[i] >= volumes[i - 1] ? '#CF9C01' : 'black'), // Color según dirección
                fill: false,
                tension: 0, // Líneas rectas
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Proveedores',
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Volumen de Productos',
                }
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '80%', padding: '20px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PedidosPorProveedor;
