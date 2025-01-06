import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const ReporteConsolidado = ({ reporte }) => {
    if (!reporte) {
        return <p>No hay datos disponibles.</p>;
    }

    const { titulo, descripcion, estado, tipo, inventario, producto } = reporte;

    return (
        <div className="table-responsive">
            <Table striped bordered hover className="table-responsive-md">
                <tbody>
                    {/* Detalles del Reporte */}
                    <tr>
                        <td><strong>Título</strong></td>
                        <td>{titulo || 'No existe registro'}</td>
                    </tr>
                    <tr>
                        <td><strong>Descripción</strong></td>
                        <td>{descripcion || 'No existe registro'}</td>
                    </tr>
                    <tr>
                        <td><strong>Estado</strong></td>
                        <td>{estado || 'Sin definir'}</td>
                    </tr>
                    <tr>
                        <td><strong>Tipo</strong></td>
                        <td>{tipo || 'No especificado'}</td>
                    </tr>

                    {/* Detalles del Inventario */}
                    {inventario ? (
                        <tr>
                            <td><strong>Inventario asociado</strong></td>
                            <td>{inventario.nombre}</td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="2"><strong>No hay inventarios asociados</strong></td>
                        </tr>
                    )}

                    {/* Detalles del Producto */}
                    {producto ? (
                        <>
                            <tr>
                                <td><strong>Producto</strong></td>
                                <td>{producto.nombre}</td>
                            </tr>
                            <tr>
                                <td><strong>Producto - Categoría</strong></td>
                                <td>{producto.categoria || 'Sin categoría'}</td>
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td colSpan="2"><strong>No hay productos asociados</strong></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

ReporteConsolidado.propTypes = {
    reporte: PropTypes.shape({
        titulo: PropTypes.string,
        descripcion: PropTypes.string,
        estado: PropTypes.string,
        tipo: PropTypes.string,
        inventario: PropTypes.shape({
            nombre: PropTypes.string,
            maximo_stock: PropTypes.number,
            ultima_actualizacion: PropTypes.string,
        }),
        producto: PropTypes.shape({
            nombre: PropTypes.string,
            descripcion: PropTypes.string,
            categoria: PropTypes.string,
            tipo: PropTypes.string,
        }),
    }).isRequired,
};

export default ReporteConsolidado;
