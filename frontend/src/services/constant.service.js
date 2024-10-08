import axios from './root.service';
import cookies from 'js-cookie';

// Obtener todas las constantes
export const getConstants = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/constants/', { headers });
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
    throw error;  // Relanza el error para manejarlo en el frontend
};

export default {
    getConstants,
};