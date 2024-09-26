import axios from './root.service';
import cookies from 'js-cookie';

// Obtener todos los pedidos
export const getAllPedidos = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/pedido/', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener un pedido por ID
export const getPedido = async (pedidoId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/pedido/detail?id=${pedidoId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Crear un nuevo pedido
export const createPedido = async (pedidoData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await axios.post('api/pedido/', pedidoData, { headers });
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
    console.error('Error al realizar la solicitud:', error);
    if (error.response) {
        console.error('Error status', error.response.status);
        console.error('Error data', error.response.data);
    }
};

export default {
    getAllPedidos,
    getPedido,
    createPedido,
};
