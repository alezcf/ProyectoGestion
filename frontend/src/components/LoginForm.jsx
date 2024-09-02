import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import '../css/LoginForm.css';
import '../css/Buttons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    const result = await login(data);
    
    if (result.status === 200) {
      navigate('/');
    } else if (result.status === 400) {
      setLoginError(result.message); // Muestra el mensaje de error personalizado
    } else {
      setLoginError('Error al intentar iniciar sesión.'); // Manejo de errores generales
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="user-image"></div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="welcome-text text-center text-primary mb-4">Inicio de Sesión</h2>
        {loginError && <div className="alert alert-danger">{loginError}</div>} {/* Mostrar mensaje de error */}
        <div className="input-container">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            {...register('email', { required: true })}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">El correo electrónico es obligatorio</div>}
        </div>
        <div className="input-container">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            {...register('password', { required: true })}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && <div className="invalid-feedback">La contraseña es obligatoria</div>}
        </div>
        <button type="submit" className="login-button">Ingresar</button>
        <button type="button" className="signup-button" onClick={() => navigate('/signup')}>Registrar</button>
        <button type="button" className="recover-button" onClick={() => navigate('/recuperate')}>Recuperar contraseña</button>
      </form>
    </div>
  );
}

export default LoginForm;
