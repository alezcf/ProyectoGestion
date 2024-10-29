import axios from './root.service';
import cookies from 'js-cookie';

// Obtener la cantidad de pedidos agrupados por estado
export const getPedidosPorEstado = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/pedido/detailEstado', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener el nivel de stock actual y máximo para cada inventario
export const getInventarioStock = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/inventario/detailStock', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener la frecuencia de pedidos y volumen de productos adquiridos agrupados por proveedor
export const getPedidosPorProveedor = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/pedido/detailProveedor', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener la frecuencia de pedidos y volumen de productos adquiridos agrupados por proveedor
export const getCantidadProductosPorCategoria = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/inventario/detailCategorias', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener la cantidad de pedidos agrupados por estado
export const getTendenciaReposicionPorCategoria = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/pedido/detailTendencia', { headers });
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
    getPedidosPorEstado,
    getInventarioStock,
    getPedidosPorProveedor,
    getCantidadProductosPorCategoria,
    getTendenciaReposicionPorCategoria,
};
