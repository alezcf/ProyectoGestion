import axios from './root.service';
import cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post('auth/login', {
      email,
      password,
    });
    const { status, data } = response;

    if (status === 200) {
      const { id, nombreCompleto, rut, email, rol } = await jwtDecode(data.data.token);
      localStorage.setItem('user', JSON.stringify({ id, nombreCompleto, rut, email, rol }));
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.data.token}`;
      cookies.set('jwt-auth', data.data.token, { path: '/' });
      return { status, data };
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { status: 400, message: 'Usuario o contraseña incorrectos' };
    } else {
      console.log(error.response.status);
      return { status: error.response.status, message: 'Error inesperado' };
    }
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  cookies.remove('jwt-auth');
};

export const test = async () => {
  try {
    const response = await axios.get('/users');
    const { status, data } = response;
    if (status === 200) {
      console.log(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};