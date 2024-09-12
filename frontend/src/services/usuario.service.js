import axios from './root.service';
import cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const getAllUsuarios = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/users/', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data; // Asumiendo que los datos de usuarios están en data.data
        }
    } catch (error) {
        handleError(error);
    }
};

export const getUsuario = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const decodedToken = jwtDecode(token);

        const response = await axios.get(`api/user/detail?rut=${decodedToken.rut}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export const deleteUsuario = async (usuarioId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.delete(`api/users/${usuarioId}`, { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.message; // Asumiendo que se devuelve un mensaje al eliminar
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
    getAllUsuarios,
    getUsuario,
    deleteUsuario,
};
