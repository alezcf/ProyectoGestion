import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reportesService from '../../services/reporte.service';
import '../../css/ReportesPanel.css'; // Asegúrate de crear este archivo para los estilos

function ReportesPanel() {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Llama a test-monitor para actualizar el estado de los reportes
                await reportesService.getTestMonitor();

                // Luego de actualizar, obtenemos los reportes
                const data = await reportesService.getReportes();
                console.log('Reportes:', data);
                setReportes(data || []);
            } catch (err) {
                setError(err.response.data.message);
            }
        };

        fetchData();
    }, []);

    // Función para manejar el click y redirigir a la página de detalles del reporte
    const handleReporteClick = (id) => {
        navigate(`/reporte/${id}`);
    };

    return (
        <div className="reportes-panel-container">
            <div className="reportes-header">
                <h2>Reportes</h2>
            </div>

            {error ? (
                <div className="error-container">
                    <h5 className="error-message">{error}</h5>
                </div>
            ) : (
                <div className="reportes-panel-content">
                    {reportes.length > 0 ? (
                        <div className="reportes-list">
                            {reportes.map((reporte) => (
                                <div
                                    key={reporte.id}
                                    className="reporte-card"
                                    onClick={() => handleReporteClick(reporte.id)}
                                >
                                    <center>
                                        <h3 className="reporte-titulo">{reporte.titulo}</h3>
                                    </center>
                                    <p className="reporte-descripcion">{reporte.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No hay reportes</p>
                    )}
                </div>
            )}
        </div>
    );

}

export default ReportesPanel;
