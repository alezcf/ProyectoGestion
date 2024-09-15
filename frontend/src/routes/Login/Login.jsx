import React from 'react';
import LoginForm from '../../components/Common/LoginForm';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../css/Login.css';

function Login() {
  const navigate = useNavigate();
  const userToken = Cookies.get('jwt-auth');
  if (userToken) {
    return (
      <>
        <h2>¡Ya estás logeado!</h2>
        <button onClick={() => navigate('/')}>Ir a home</button>
      </>
    );
  }
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
}

export default Login;
