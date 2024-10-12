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

// Actualizar un producto por ID
export const updateProducto = async (productoData) => {
    try {
        const { id: productoId } = productoData;
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await axios.put(`api/producto/?id=${productoId}`, productoData, { headers });

        return response;
    } catch (error) {
        handleError(error);
    }
};

// Actualizar imagen de un producto
export const updateProductoImagen = async (productoId, imagenData) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',  // Enviar la imagen como parte del formulario
        };

        const formData = new FormData();
        formData.append('imagen', imagenData);  // Aquí se envía la imagen en sí
        console.log('Imagen:', imagenData);
        console.log('FormData:', formData);
        console.log('id:', productoId);
        const response = await axios.post(`api/producto/update-imagen?id=${productoId}`, formData, { headers });
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
    throw error;
};

export default {
    getAllProductos,
    getProducto,
    createProducto,
    updateProducto,
    updateProductoImagen,
};
