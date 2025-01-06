import axios from './root.service';
import cookies from 'js-cookie';

export const getAllInventarios = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/inventario/', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export const getInventarioById = async (inventarioId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/inventario/detail?id=${inventarioId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Crear un nuevo inventario
export const createInventario = async (inventarioData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Formato JSON
        };

        const response = await axios.post('api/inventario/', inventarioData, { headers });
        const { status, data } = response;
        if (status === 201) {  // Estado 201 indica que el recurso fue creado
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export const updateInventario = async (inventarioId, inventarioData) => {
    try {
        const token = cookies.get('jwt-auth');
        console.log(inventarioData);
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Formato JSON
        };

        const response = await axios.put(`api/inventario/?id=${inventarioId}`, inventarioData, { headers });

        console.log(response);
        return response;
    } catch (error) {
        handleError(error);
    }
};

export const deleteInventario = async (inventarioId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.delete(`api/inventario/?id=${inventarioId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.message; // Asume que el backend devuelve un mensaje
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
    throw error.response.data;  // Relanza el error para manejarlo en el frontend
};



export default {
    getAllInventarios,
    getInventarioById,
    createInventario,
    deleteInventario,
    updateInventario,
};
