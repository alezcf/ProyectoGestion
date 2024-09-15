// src/components/Inventario/InventarioDetalles.js
import React from 'react';
import PropTypes from 'prop-types';
import CustomTable from '../Common/CustomTable';
import ButtonsActions from '../Common/ButtonsActionsTable';  // Importamos el nuevo componente
import '../../css/Buttons.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const InventarioDetalles = ({ selectedData }) => {
    const headers = ['Nombre', 'Categoria', 'Marca', 'Contenido', 'Precio', 'Imagen', 'Acciones'];

    const handleExport = (productoNombre) => {
        console.log(`Exportando datos del producto: ${productoNombre}`);
        // Aquí puedes implementar la lógica de exportación
    };

    const renderRow = (productoInventario, index) => {
        const producto = productoInventario.producto;
        const rutaImagen = producto.imagen_ruta
            ? producto.imagen_ruta.replace(/\\/g, '/')
            : null;

        return (
            <tr key={index}>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>{producto.marca}</td>
                <td>{productoInventario.cantidad} {producto.unidad_medida}</td>
                <td>${producto.precio}</td>
                <td>
                    <img
                        src={rutaImagen ? `${BASE_URL}${rutaImagen}` : '/images/NoExiste.png'}
                        alt={rutaImagen ? 'Imagen del producto' : 'Imagen no disponible'}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                </td>
                <td>
                    <ButtonsActions
                        itemId={producto.id}
                        itemName={producto.nombre}
                        onExport={handleExport}
                        detailsRoute="/producto"
                    />
                </td>
            </tr>
        );
    };

    return <CustomTable headers={headers} data={selectedData.productoInventarios} renderRow={renderRow} />;
};

InventarioDetalles.propTypes = {
    selectedData: PropTypes.shape({
        productoInventarios: PropTypes.arrayOf(PropTypes.shape({
            producto: PropTypes.shape({
                id: PropTypes.number.isRequired,
                nombre: PropTypes.string.isRequired,
                categoria: PropTypes.string,
                marca: PropTypes.string,
                cantidad: PropTypes.string,
                unidad_medida: PropTypes.string,
                precio: PropTypes.string,
                imagen_ruta: PropTypes.string,
            }).isRequired,
        })).isRequired,
    }).isRequired,
};

export default InventarioDetalles;
