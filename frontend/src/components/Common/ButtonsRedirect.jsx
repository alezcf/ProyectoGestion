import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../../css/Buttons.css';

const RedireccionBotones = ({ ruta1, ruta2, texto1, texto2, id1, id2 }) => {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-between mt-3 mb-3">
            {/* Botón para redirigir a la primera ruta */}
            {ruta1 && id1 && (
                <button
                    type="button"
                    className="button recover-button"
                    onClick={() => navigate(`${ruta1}/${id1}`)}
                >
                    {texto1}
                </button>
            )}

            {/* Botón para redirigir a la segunda ruta */}
            {ruta2 && id2 && (
                <button
                    type="button"
                    className="button login-button"
                    onClick={() => navigate(`${ruta2}/${id2}`)}
                >
                    {texto2}
                </button>
            )}
        </div>
    );
};

RedireccionBotones.propTypes = {
    ruta1: PropTypes.string,
    ruta2: PropTypes.string,
    texto1: PropTypes.string,
    texto2: PropTypes.string,
    id1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

RedireccionBotones.defaultProps = {
    ruta1: null,
    ruta2: null,
    texto1: '',
    texto2: '',
    id1: null,
    id2: null,
};

export default RedireccionBotones;
