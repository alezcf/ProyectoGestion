// src/logic/useInventarioData.js
import { useEffect, useState } from 'react';
import inventarioService from '../services/inventario.service';

const useInventarioData = () => {
    const [inventarioData, setInventarioData] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventario = async () => {
            try {
                const data = await inventarioService.getAllInventarios();
                setInventarioData(data);
                setCategorias(extractCategorias(data));
            } catch (error) {
                setError(error.message);
            }
        };
        fetchInventario();
    }, []);

    const extractCategorias = (data) => {
        return data.reduce((acc, inventario) => {
            inventario.productoInventarios.forEach((productoInventario) => {
                const categoria = productoInventario.producto.categoria;
                if (!acc.includes(categoria)) {
                    acc.push(categoria);
                }
            });
            return acc;
        }, []);
    };

    return { inventarioData, categorias, error };
};


export default useInventarioData;
