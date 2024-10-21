import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import '../../css/DetallesEstandar.css';  // Importamos el CSS estandarizado

const ProveedorDetalles = ({ proveedor }) => {
    return (
        <div className="detalles-container">
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <td><strong>Nombre del Proveedor:</strong></td>
                        <td>{proveedor.nombre || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>RUT:</strong></td>
                        <td>{proveedor.rut || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>Dirección:</strong></td>
                        <td>{proveedor.direccion || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>Teléfono:</strong></td>
                        <td>{proveedor.telefono || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>{proveedor.email || "No existe registro"}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

ProveedorDetalles.propTypes = {
    proveedor: PropTypes.shape({
        nombre: PropTypes.string,
        rut: PropTypes.string,
        direccion: PropTypes.string,
        telefono: PropTypes.string,
        email: PropTypes.string,
    }).isRequired,
};

export default ProveedorDetalles;
