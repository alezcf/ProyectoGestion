import axios from './root.service';
import cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const getAllUsuarios = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('api/user/', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data; // Asumiendo que los datos de usuarios están en data.data
        }
    } catch (error) {
        handleError(error);
    }
};

export const getUsuario = async (id) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        let query;

        console.log("La id es: ", id);

        if (id) {
            query = `id=${id}`;
        } else {
            const decodedToken = jwtDecode(token);
            console.log("El token decodificado es: ", decodedToken);
            const id = decodedToken.id;
            query = `id=${id}`;
        }

        const response = await axios.get(`api/user/detail?${query}`, { headers });
        const { status, data } = response;

        if (status === 200) {
            return data.data; // Devolver los datos si la respuesta es exitosa
        }
    } catch (error) {
        handleError(error); // Manejar cualquier error que ocurra
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

export const createUsuario = async (nuevoUsuario) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Aseguramos el tipo de contenido JSON
        };

        const response = await axios.post('api/user/', nuevoUsuario, { headers });

        return response;
    } catch (error) {
        handleError(error);
    }
};

export const updateUsuario = async (rut, usuarioActualizado) => {
    try {
        console.log(usuarioActualizado);
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Aseguramos el tipo de contenido JSON
        };

        const response = await axios.put(`api/user/?rut=${rut}`, usuarioActualizado, { headers });

        return response;
    } catch (error) {
        handleError(error); // Manejar cualquier error que ocurra
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post('api/user/reset-password',
            {
                token,        // El token recibido por el usuario
                newPassword,  // La nueva contraseña proporcionada por el usuario
            },
            { headers: { 'Content-Type': 'application/json' } } // Asegurarse de que estamos enviando JSON
        );

        const { status, data } = response;

        if (status === 200) {
            return data.message || "Contraseña restablecida exitosamente";  // Mensaje de éxito
        }
    } catch (error) {
        handleError(error);  // Manejar el error si ocurre
    }
};

export const toggleUsuarioStatus = async (usuarioId) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await axios.post(`api/user/statusUser?id=${usuarioId}`, {}, { headers });
        const { status, data } = response;

        if (status === 200) {
            return data.message || "Estado del usuario actualizado correctamente"; // Mensaje de éxito
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
    createUsuario,
    resetPassword,
    updateUsuario,
    toggleUsuarioStatus,
};
