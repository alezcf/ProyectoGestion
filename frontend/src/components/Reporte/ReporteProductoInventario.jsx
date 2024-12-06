import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const ReporteProductoInventario = ({ inventario, producto }) => {
    return (
        <Table striped bordered hover>
            <tbody>
                {/* Detalles del Inventario */}
                {inventario ? (
                    <>
                        <tr>
                            <td><strong>Inventario - Nombre</strong></td>
                            <td>{inventario.nombre}</td>
                        </tr>
                        <tr>
                            <td><strong>Inventario - Stock Máximo</strong></td>
                            <td>{inventario.maximo_stock}</td>
                        </tr>
                        <tr>
                            <td><strong>Inventario - Última Actualización</strong></td>
                            <td>
                                {inventario.ultima_actualizacion
                                    ? new Date(inventario.ultima_actualizacion).toLocaleString()
                                    : "Sin actualizar"}
                            </td>
                        </tr>
                    </>
                ) : (
                    <tr>
                        <td colSpan="2"><strong>No hay inventarios asociados</strong></td>
                    </tr>
                )}

                {/* Detalles del Producto */}
                {producto ? (
                    <>
                        <tr>
                            <td><strong>Producto - Nombre</strong></td>
                            <td>{producto.nombre}</td>
                        </tr>
                        <tr>
                            <td><strong>Producto - Descripción</strong></td>
                            <td>{producto.descripcion}</td>
                        </tr>
                        <tr>
                            <td><strong>Producto - Categoría</strong></td>
                            <td>{producto.categoria || 'Sin categoría'}</td>
                        </tr>
                        <tr>
                            <td><strong>Producto - Tipo</strong></td>
                            <td>{producto.tipo || 'Sin tipo'}</td>
                        </tr>
                    </>
                ) : (
                    <tr>
                        <td colSpan="2"><strong>No hay productos asociados</strong></td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

ReporteProductoInventario.propTypes = {
    inventario: PropTypes.object,
    producto: PropTypes.object,
};

export default ReporteProductoInventario;
