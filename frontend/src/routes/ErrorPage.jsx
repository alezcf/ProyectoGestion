import { useRouteError } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import '../css/ErrorPage.css'; 
import '../css/Buttons.css';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();

  const onSubmit = (data) => {
    login(data)
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        setDataError('Usuario o contraseña incorrectos');
      });
  };

  return (
    <Container fluid className="error-page d-flex align-items-center justify-content-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="text-center w-100">
          <Col>
            <h1>Error</h1>
            <p>La dirección ingresada no existe.</p>
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
            <button type="button" className="login-button" onClick={() => navigate('/')}>Página principal</button>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default ErrorPage;
