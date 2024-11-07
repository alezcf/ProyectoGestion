// PedidoProducto.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import CustomTable from '../Common/SecondaryTable.jsx'; // Asegúrate de importar CustomTable correctamente

const PedidoProducto = ({ productos, onInfo, onDelete }) => {
    const headers = ["Nombre del Producto", "Cantidad", "Precio", "Subtotal", "Acciones"];

    // Función para renderizar cada fila, utilizando la estructura proporcionada en `CustomTable`
    const renderRow = (rowData, index) => (
        <tr key={index}>
            <td>{rowData.producto.nombre}</td>
            <td>{rowData.cantidad}</td>
            <td>${rowData.precio}</td>
            <td>${rowData.cantidad * rowData.precio}</td>
            <td>
                <button
                    type="button"
                    className="button btn-info"
                    onClick={() => onInfo(rowData.producto.id)}
                >
                    <InfoCircle />
                </button>
                <button
                    type="button"
                    className="button btn-delete"
                    onClick={() => onDelete(rowData.producto.id)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    );

    return (
        <CustomTable
            headers={headers}
            data={productos}
            renderRow={renderRow}
        />
    );
};

PedidoProducto.propTypes = {
    productos: PropTypes.arrayOf(
        PropTypes.shape({
            producto: PropTypes.shape({
                id: PropTypes.number.isRequired,
                nombre: PropTypes.string.isRequired,
            }).isRequired,
            cantidad: PropTypes.number.isRequired,
            precio: PropTypes.number.isRequired,
        })
    ).isRequired,
    onInfo: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default PedidoProducto;
