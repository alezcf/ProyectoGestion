// src/pages/Perfil/Perfil.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PerfilInfo from '../../components/Perfil/PerfilInfo';
import { getUsuario } from '../../services/usuario.service';

const Perfil = () => {
    const { usuarioId } = useParams();
    const [perfilData, setPerfilData] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await getUsuario(usuarioId);
                setPerfilData(data);
                setLoading(false); // Cambiar a 'false' una vez que los datos se cargan
            } catch (err) {
                setError('Error al cargar el perfil');
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [usuarioId]); // Dependencia de 'usuarioId', la función solo se ejecuta cuando cambia

    if (loading) return <p>Cargando...</p>; // Mostrar un mensaje de carga mientras se obtienen los datos
    if (error) return <p>{error}</p>; // Mostrar el mensaje de error en caso de fallo

    return perfilData ? <PerfilInfo perfilData={perfilData} /> : null;
};

export default Perfil;
