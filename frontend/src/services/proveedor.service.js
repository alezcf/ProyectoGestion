// src/services/inventario.service.js
import axios from './root.service';
import cookies from 'js-cookie';

export const getAllProveedores = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/proveedor/', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export const getProveedor = async (productoId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/proveedor/detail?id=${productoId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

const handleError = (error) => {
    console.error('API call error:', error);
    throw error;
};

export default {
    getAllProveedores,
    getProveedor,
};
