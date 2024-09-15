import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import '../../css/Inventario.css'; // Archivo de estilos compartido

const CustomTable = ({ headers, data, renderRow }) => (
    <div className="table-responsive">
        <Table striped bordered hover responsive="md" className="inventario-table">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((rowData, index) => renderRow(rowData, index))}
            </tbody>
        </Table>
    </div>
);

CustomTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderRow: PropTypes.func.isRequired, // Función para renderizar las filas
};

export default CustomTable;
