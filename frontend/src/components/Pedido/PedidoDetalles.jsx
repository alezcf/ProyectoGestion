import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import '../../css/DetallesEstandar.css';  // Importamos el CSS estandarizado

const PedidoDetalles = ({ pedido }) => {
    return (
        <div className="detalles-container">
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <td><strong>Fecha del Pedido:</strong></td>
                        <td>{new Date(pedido.fecha_pedido).toLocaleDateString() || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>Estado:</strong></td>
                        <td>{pedido.estado || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>Proveedor:</strong></td>
                        <td>{pedido.proveedor?.nombre || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>RUT Proveedor:</strong></td>
                        <td>{pedido.proveedor?.rut || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>Inventario Asignado:</strong></td>
                        <td>{pedido.inventarioAsignado?.nombre || "No existe registro"}</td>
                    </tr>
                    <tr>
                        <td><strong>Última Actualización del Inventario:</strong></td>
                        <td>{new Date(pedido.inventarioAsignado?.ultima_actualizacion).toLocaleDateString() || "No existe registro"}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

PedidoDetalles.propTypes = {
    pedido: PropTypes.shape({
        fecha_pedido: PropTypes.string,
        estado: PropTypes.string,
        proveedor: PropTypes.shape({
            nombre: PropTypes.string,
            rut: PropTypes.string,
        }),
        inventarioAsignado: PropTypes.shape({
            nombre: PropTypes.string,
            ultima_actualizacion: PropTypes.string,
        }),
    }).isRequired,
};

export default PedidoDetalles;
