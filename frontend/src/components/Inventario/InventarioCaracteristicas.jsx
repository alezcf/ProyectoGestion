import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic'; // Importamos la función de formateo

const InventarioCaracteristicas = ({ inventario }) => (
    <div>
        <Table striped bordered hover responsive>
            <tbody style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Nombre</td>
                    <td style={{ textAlign: 'left' }}>{inventario.nombre || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Máximo Stock</td>
                    <td style={{ textAlign: 'left' }}>{inventario.maximo_stock || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Última Actualización</td>
                    <td style={{ textAlign: 'left' }}>
                        {inventario.ultima_actualizacion ? formatDateToDDMMYYYY(inventario.ultima_actualizacion) : 'No hay registro'}
                    </td>
                </tr>
            </tbody>
        </Table>
    </div>
);

InventarioCaracteristicas.propTypes = {
    inventario: PropTypes.shape({
        nombre: PropTypes.string,
        maximo_stock: PropTypes.number,
        ultima_actualizacion: PropTypes.string,
    }).isRequired,
};

export default InventarioCaracteristicas;
