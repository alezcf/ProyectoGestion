// src/pages/Perfil/Perfil.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PerfilInfo from '../../components/Perfil/PerfilInfo';
import { getUsuario } from '../../services/usuario.service';

const Perfil = () => {
    const { usuarioId } = useParams();
    const [perfilData, setPerfilData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
        try {
            const data = await getUsuario(usuarioId);
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

    return perfilData ? <PerfilInfo perfilData={perfilData} /> : null;
};

export default Perfil;
