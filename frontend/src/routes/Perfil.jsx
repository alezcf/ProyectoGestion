import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsuario } from '../services/usuario.service';
const Perfil = () => {
    const { usuarioId } = useParams();
    const [perfilData, setPerfilData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await getUsuario();
                setPerfilData(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el perfil');
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [usuarioId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        perfilData && (
        <div style={styles.container}>
            <h1>Perfil de Usuario</h1>
            <div style={styles.info}>
                <p><strong>RUT:</strong> {perfilData.rut}</p>
                <p><strong>Email:</strong> {perfilData.email}</p>
                <p><strong>Rol:</strong> {perfilData.rol}</p>
                <p><strong>Nombre Completo:</strong> {perfilData.nombreCompleto}</p>
                <p><strong>Registro Cuenta:</strong> {perfilData.registroCuenta}</p>
            </div>
        </div>
        )
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: '10px',
    },
    info: {
        lineHeight: '1.5',
    },
};

export default Perfil;
