import React, { useEffect, useState } from 'react';
import reportesService from '../../services/reporte.service';
import '../../css/ReportesPanel.css'; // Asegúrate de crear este archivo para los estilos

function ReportesPanel() {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Llama a test-monitor para actualizar el estado de los reportes
                await reportesService.getTestMonitor();

                // Luego de actualizar, obtenemos los reportes
                const data = await reportesService.getReportes();
                setReportes(data || []);
            } catch (err) {
                setError("Error al cargar reportes");
            }
        };

        fetchData();
    }, []);

    return (
        <div className="reportes-panel-content">
            {error && <p className="error">{error}</p>}
            <div className="reportes-list">
                {reportes.length > 0 ? (
                    reportes.map((reporte, index) => (
                        <div key={index} className="reporte-card">
                            <center><h3 className="reporte-titulo">{reporte.titulo}</h3></center>
                            <p className="reporte-descripcion">{reporte.descripcion}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay reportes</p>
                )}
            </div>
        </div>
    );
}

export default ReportesPanel;
