import axios from './root.service';
import cookies from 'js-cookie';

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post('api/auth/login', {
      email,
      password,
    });
    const { status, data } = response;

    if (status === 200) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.data.token}`;
      cookies.set('jwt-auth', data.data.token, { path: '/' });
      return { status, data };
    }
  } catch (error) {
    return error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  cookies.remove('jwt-auth');
};

export const test = async () => {
  try {
    const response = await axios.get('api/users');
    const { status, data } = response;
    if (status === 200) {
      console.log(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};