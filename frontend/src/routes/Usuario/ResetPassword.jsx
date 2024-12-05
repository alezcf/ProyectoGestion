import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { resetPassword } from '../../services/usuario.service'; // Asegúrate de que el servicio esté importado
import '../../css/Buttons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Login.css';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Extraer el token de la URL
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null); // Para mostrar errores
  const { handleSubmit, register, formState: { errors }, watch } = useForm();

  // Función para enviar el formulario
  const onSubmit = async (data) => {
    try {
      // Llamar al servicio para restablecer la contraseña
      const message = await resetPassword(token, data.password);

      // Si la respuesta es exitosa, redirigir al login
      alert(message); // Aquí puedes mostrar un mensaje al usuario
      navigate('/'); // Redirigir a la página de login
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const navigateToHome = () => {
    navigate('/'); // Redirigir a la página principal
  };

  return (
    <div className="login-page">

      <Container fluid className="login-container d-flex justify-content-center align-items-center">
        <Row className="w-100">
          <Col md={6} lg={4} className="input-container">
            <form onSubmit={handleSubmit(onSubmit)}>

            <h2 className="text-center mb-4" style={{ color: 'white' }}>
                <FontAwesomeIcon icon={faLock} className="me-2" style={{ color: 'white' }} />
                Verificación
              </h2>

              {/* Mostrar mensaje de error si hay uno */}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              {/* Campo de contraseña */}
              <div className="mb-3">
              <label
                  htmlFor="password"
                  className="form-label"
                  style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}
                >
                  Ingresa tu Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Introduce tu nueva contraseña"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                  })}
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              {/* Campo de confirmación de contraseña */}
              <div className="mb-3">
              <label
                  htmlFor="password"
                  className="form-label"
                  style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}
                >
                  Reescribe tu contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirma tu nueva contraseña"
                  {...register('confirmPassword', {
                    required: 'La confirmación de la contraseña es obligatoria',
                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden'
                  })}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                className="button login-button w-100"
              >
                Registrar
              </button>

              <button
                type="button"
                className="button recover-button" // Añadí un margen superior para separarlo del botón anterior
                onClick={navigateToHome} // Acción de redirigir
              >
                Página Principal
              </button>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
