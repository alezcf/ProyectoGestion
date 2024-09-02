import reportesService from '../services/reporte.service';

export const fetchAllReportes = async (setReportes, setError) => {
    try {
        const data = await reportesService.getAllReportes();
        console.log("Data recibida por reportes = ", data);
        setReportes(data);
    } catch (error) {
        setError(error.message);
    }
};

export const eliminarReporte = async (reporteId, setReportes, setError, reportes) => {
    try {
        await reportesService.deleteReporte(reporteId);
        setReportes(reportes.filter(reporte => reporte._id !== reporteId));
        console.log(`Reporte con ID: ${reporteId} eliminado`);
    } catch (error) {
        setError(error.message);
    }
};
