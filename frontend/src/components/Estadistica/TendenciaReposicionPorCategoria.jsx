import React, { useEffect, useState } from 'react';
import { getTendenciaReposicionPorCategoria } from '../../services/estadistica.service';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TendenciaReposicionPorCategoria = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetches and processes data from the service
    const fetchData = async () => {
        try {
            const result = await getTendenciaReposicionPorCategoria();
            const groupedData = processResult(result);
            setData(groupedData);
        } catch (error) {
            console.error('Error al obtener la tendencia de reposición por categoría:', error);
        }
    };

    // Processes the raw result to aggregate data by the last 3 months
    const processResult = (result) => {
        const last3Months = getLast4Months();
        return last3Months.map(mes => groupDataByMonth(result, mes));
    };

    // Retrieves the last 3 months in Spanish and converts to uppercase
    const getLast4Months = () => {
        return Array.from({ length: 4 })
            .map((_, i) => format(subMonths(new Date(), i), 'MMMM', { locale: es }).toUpperCase())
            .reverse();
    };

    // Groups data by month and calculates the volume
    const groupDataByMonth = (result, mes) => {
        const monthData = result.filter(item => format(new Date(item.mes), 'MMMM', { locale: es }).toUpperCase() === mes);
        const volumen = monthData.reduce((sum, item) => sum + Number(item.volumen), 0);
        return { mes, volumen };
    };

    // Chart configuration
    const chartData = {
        labels: data.map(item => item.mes),
        datasets: [
            {
                label: 'Cantidad de productos adquiridos',
                data: data.map(item => item.volumen),
                backgroundColor: '#21A99B',
                borderColor: 'black',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: context => `${Number(context.raw)} productos adquiridos.`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Mes',
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Productos',
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default TendenciaReposicionPorCategoria;
