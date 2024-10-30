import React, { useEffect, useState } from 'react';
import reportesService from '../../services/reporte.service';

function ReportesPanel() {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const data = await reportesService.getReportes();
                setReportes(data || []);
            } catch (err) {
                setError("Error al cargar reportes");
            }
        };
        fetchReportes();
    }, []);

    return (
        <div className="reportes-panel-content">
            <h2>Reportes</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {reportes.length > 0 ? (
                    reportes.map((reporte, index) => (
                        <li key={index}>{reporte.titulo}</li> // Mostramos el título del reporte
                    ))
                ) : (
                    <li>No hay reportes</li>
                )}
            </ul>
        </div>
    );
}

export default ReportesPanel;
