import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import '../css/Spinner.css'; // Importamos el CSS del spinner

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    // Establecer un temporizador de 1.7 segundos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1700);

    // Limpiar el temporizador si el componente se desmonta antes de que se complete
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (localStorage.getItem('user')) {
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
