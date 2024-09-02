import axios from './root.service';
import cookies from 'js-cookie';

export const getAllInventarios = async () => {
    try {
        const token = cookies.get('jwt-auth');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('/inventarios/', { headers });
        const { status, data } = response;
        if (status === 200) {
            return data.data;
        }
    } catch (error) {
        handleError(error);
    }
};

export default {
    getAllInventarios,
};
