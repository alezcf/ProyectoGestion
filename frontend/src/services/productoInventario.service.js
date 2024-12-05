import axios from './root.service';
import cookies from 'js-cookie';

// Crear relaciones entre producto e inventarios
export const createProductoInventarios = async (productoId, inventariosIds, cantidades) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        console.log("llegada al createProductoInventarios");
        const requestData = {
            productoId,
            inventariosIds,
            cantidades,
        };

        const response = await axios.post('api/producto-inventarios/', requestData, { headers });

        const { status, data } = response;

        if (status === 201) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener todos los inventarios de un producto
export const getInventariosByProducto = async (productoId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/producto-inventarios?productoId=${productoId}`, { headers });
        const { status, data } = response;

        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener todos los inventarios de un producto
export const getProductosByInventario = async (inventarioId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/producto-inventarios?inventarioId=${inventarioId}`, { headers });
        const { status, data } = response;

        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Actualizar relaciones entre producto e inventarios
export const updateProductoInventarios = async (productoId, inventariosIds, cantidades) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const requestData = {
            productoId,
            inventariosIds,
            cantidades,
        };

        const response = await axios.put(`api/producto-inventarios?productoId=${productoId}`, requestData, { headers });
        const { status, data } = response;
        console.log(response);
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        console.log(error.response.data.message);
        handleError(error.response);
    }
};

// Eliminar una relación específica entre producto e inventario
export const deleteProductoInventarios = async (relacionId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        console.log("relacionId: " + relacionId);

        const response = await axios.delete(`api/producto-inventarios?relacionId=${relacionId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export const updateCantidadProductoInventario = async (relacionId, nuevaCantidad) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const requestData = {
            relacionId,
            nuevaCantidad,
        };

        const response = await axios.patch('api/producto-inventarios/', requestData, { headers });
        const { status, data } = response;

        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        console.log(error.response.data.message);
        handleError(error.response);
    }
};

// Manejo de errores
const handleError = (error) => {
    throw error;
};

export default {
    createProductoInventarios,
    getInventariosByProducto,
    updateProductoInventarios,
    updateCantidadProductoInventario,
    deleteProductoInventarios,
    getProductosByInventario
};
