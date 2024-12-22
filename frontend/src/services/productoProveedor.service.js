import axios from './root.service';
import cookies from 'js-cookie';

// Crear relaciones entre producto y proveedores
export const createProductoProveedores = async (productoId, proveedoresIds) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const requestData = {
            productoId,
            proveedoresIds,
        };

        const response = await axios.post('api/producto-proveedores/', requestData, { headers });
        const { status, data } = response;
        if (status === 201) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener todos los proveedores de un producto
export const getProveedoresByProducto = async (productoId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/producto-proveedores?productoId=${productoId}`, { headers });
        const { status, data } = response;

        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Actualizar relaciones entre producto y proveedores
export const updateProductoProveedores = async (productoId, proveedoresIds) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const requestData = {
            proveedoresIds,
        };

        const response = await axios.put(`api/producto-proveedores/?productoId=${productoId}`, requestData, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};
// Eliminar una relación específica entre producto y proveedor
export const deleteProductoProveedores = async (relacionId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        // Hacemos la solicitud para eliminar la relación por el ID de la relación (clave primaria)
        const response = await axios.delete(`api/producto-proveedores?relacionId=${relacionId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

// Obtener todos los proveedores de un producto
export const getProductosByProveedor = async (proveedorId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`api/producto-proveedores/proveedor-producto?proveedorId=${proveedorId}`, { headers });

        return response;

    } catch (error) {
        handleError(error);
    }
};

// Manejo de errores
const handleError = (error) => {
    console.error('Error en la petición:', error);
    throw error; // Puedes personalizar este manejo si deseas
};

export default {
    createProductoProveedores,
    getProveedoresByProducto,
    updateProductoProveedores,
    deleteProductoProveedores,
    getProductosByProveedor,
};
