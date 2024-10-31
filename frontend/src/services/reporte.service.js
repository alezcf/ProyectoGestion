import axios from './root.service';
import cookies from 'js-cookie';

// Obtener todos los reportes con filtros opcionales de estado y tipo
export const getReportes = async (estado = null, tipo = null) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/reporte', {
            headers,
            params: { estado, tipo }
        });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener detalle de un reporte específico por ID
export const getReporte = async (id) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        console.log('id', id);

        const response = await axios.get(`api/reporte/detail`, {
            headers,
            params: { id }
        });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Crear un nuevo reporte
export const createReporte = async (reporteData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.post('api/reporte', reporteData, { headers });
        const { status, data } = response;
        if (status === 201) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Actualizar un reporte completo
export const updateReporte = async (id, reporteData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.put(`api/reporte`, { id, ...reporteData }, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Cambiar el estado de un reporte específico
export const updateEstadoReporte = async (id, estado) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.put('api/reporte/estado', { id, estado }, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Eliminar un reporte por ID
export const deleteReporte = async (id) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.delete('api/reporte', {
            headers,
            data: { id }
        });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener resumen de reportes agrupados por tipo
export const getReporteResumenPorTipo = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/reporte/resumen/tipo', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener conteo de reportes agrupados por estado
export const getReporteEstados = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/reporte/estados', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Manejo de errores
const handleError = (error) => {
    console.error('Error en la llamada a la API:', error);
    if (error.response) {
        console.error('Código de estado:', error.response.status);
        console.error('Datos del error:', error.response.data);
    }
    throw error; // Relanza el error para manejarlo en el frontend
};

export const getTestMonitor = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/reporte/test-monitor', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export default {
    getReportes,
    getReporte,
    createReporte,
    updateReporte,
    updateEstadoReporte,
    deleteReporte,
    getReporteResumenPorTipo,
    getReporteEstados,
    getTestMonitor,
};
