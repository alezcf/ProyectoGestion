import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Row, Col } from 'react-bootstrap';
import { resetPassword } from '../../services/usuario.service'; // Asegúrate de que el servicio esté importado
import '../../css/Buttons.css';

const ResetPasswordPage = () => {
  const { token } = useParams();  // Extraer el token de la URL
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);  // Para mostrar errores
  const { handleSubmit, register, formState: { errors } } = useForm();

  // Función para enviar el formulario
  const onSubmit = async (data) => {
    try {
      // Llamar al servicio para restablecer la contraseña
      const message = await resetPassword(token, data.password);

      // Si la respuesta es exitosa, redirigir al login
      alert(message);  // Aquí puedes mostrar un mensaje al usuario
      navigate('/');  // Redirigir a la página de login
    } catch (error) {
      // Si ocurre algún error, mostrarlo
      setErrorMessage('No se pudo restablecer la contraseña. Intenta de nuevo.');
    }
  };

  return (
    <Container fluid className="reset-password-page d-flex align-items-center justify-content-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="text-center w-100">
          <Col>
            <h1>Restablecer Contraseña</h1>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <div className="form-group">
              <label htmlFor="password">Nueva Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Introduce tu nueva contraseña"
                {...register('password', { required: true, minLength: 6 })}
              />
              {errors.password && <p className="text-danger">La contraseña es obligatoria y debe tener al menos 6 caracteres.</p>}
            </div>

            <button type="submit" className="button login-button">Restablecer Contraseña</button>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default ResetPasswordPage;
