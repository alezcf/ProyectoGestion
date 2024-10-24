import axios from './root.service';
import cookies from 'js-cookie';

// Exportar datos a Excel
export const exportDataToExcel = async (data) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Configura la respuesta como blob para manejar archivos
        const response = await axios.post('api/export/export', { arrayData: data }, { headers, responseType: 'blob' });

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'usuarios_export.xlsx'); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);  // Remover el enlace después de hacer clic
    } catch (error) {
        handleError(error);
    }
};

export const exportObjectAndArraysToExcel = async (dataObject, arrayData, sheetNames) => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Configura la respuesta como blob para manejar archivos
        const response = await axios.post(
            'api/export/exportObject',
            { dataObject, arrayData, sheetNames},
            { headers, responseType: 'blob' }
        );

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'object_and_arrays_export.xlsx'); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);  // Remover el enlace después de hacer clic
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
    exportDataToExcel,
    exportObjectAndArraysToExcel,
};
