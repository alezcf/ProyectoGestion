import axios from './root.service';
import cookies from 'js-cookie';

// Obtener todos los productos
export const getAllProductos = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/producto/', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener un producto por ID
export const getProducto = async (productoId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/producto/detail?id=${productoId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Crear un nuevo producto
export const createProducto = async (productoData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',  // Si estás enviando un archivo (como una imagen)
        };

        const response = await axios.post('api/producto/', productoData, { headers });
        const { status, data } = response;
        if (status === 201) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Manejo de errores
const handleError = (error) => {
    console.error('API call error:', error);
    throw error;
};

export default {
    getAllProductos,
    getProducto,
    createProducto,
};
