import { useEffect, useState } from 'react';
import inventarioService from '../services/inventario.service';

// Hook personalizado para obtener los datos del inventario y categorías
const useInventarioData = () => {
    const [inventarioData, setInventarioData] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventario = async () => {
            try {
                const data = await inventarioService.getAllInventarios(); // Obtener todos los inventarios
                setInventarioData(data); // Establecer los datos del inventario
                setCategorias(extractCategorias(data)); // Extraer categorías de los productos
            } catch (error) {
                setError(error.message); // Manejar el error
            }
        };
        fetchInventario(); // Llamar a la función de obtención de inventarios
    }, []);

    // Función para extraer categorías únicas de los productos en los inventarios
    const extractCategorias = (data) => {
        return data.reduce((acc, inventario) => {
            inventario.productoInventarios.forEach((productoInventario) => {
                const categoria = productoInventario.producto.categoria;
                if (!acc.includes(categoria)) {
                    acc.push(categoria); // Agregar categoría si no está en la lista
                }
            });
            return acc;
        }, []);
    };

    return { inventarioData, categorias, error }; // Retornar datos, categorías y error
};

// Función para filtrar el inventario según el inventario y la categoría seleccionados
export const filtrarInventario = (inventarioData, selectedInventario, selectedCategoria) => {
    const selectedData = inventarioData.find(inv => inv.id === parseInt(selectedInventario)); // Buscar inventario seleccionado

    if (!selectedData) {
        return null; // Retornar null si no se encuentra el inventario
    }

    // Filtrar productos por categoría seleccionada (si aplica) o retornar todos los productos
    return {
        ...selectedData,
        productoInventarios: selectedCategoria
            ? selectedData.productoInventarios.filter(productoInventario =>
                productoInventario.producto.categoria === selectedCategoria)
            : selectedData.productoInventarios
    };
};

export default useInventarioData;
