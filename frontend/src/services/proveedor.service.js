import axios from './root.service';
import cookies from 'js-cookie';

// Obtener todos los proveedores
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

// Obtener un proveedor por ID
export const getProveedor = async (proveedorId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/proveedor/detail?id=${proveedorId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Crear un nuevo proveedor
export const createProveedor = async (proveedorData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Enviar datos como JSON
        };

        const response = await axios.post('api/proveedor/', proveedorData, { headers });
        const { status, data } = response;
        if (status === 201) {  // Estado 201 indica que el recurso fue creado
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export const updateProveedor = async (id, proveedorData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Enviar datos como JSON
        };

        const response = await axios.put(`api/proveedor/?id=${id}`, proveedorData, { headers });

        return response;
    } catch (error) {
        handleError(error);
    }
};

// Manejo de errores
const handleError = (error) => {
    console.error('Error en la llamada a la API:', error);
    throw error;  // Relanza el error para manejarlo en el frontend
};

export default {
    getAllProveedores,
    getProveedor,
    createProveedor,
    updateProveedor,
};
