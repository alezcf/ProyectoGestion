import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
  const navigate = useNavigate();

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
