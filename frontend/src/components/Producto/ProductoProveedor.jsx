import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductoProveedor = ({ proveedores }) => (
    <div className="mt-4">
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Teléfono</th>
                </tr>
            </thead>
            <tbody>
                {proveedores.length > 0 ? (
                    proveedores.map(proveedor => (
                        <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.nombre}</td>
                            <td>{proveedor.contacto}</td>
                            <td>{proveedor.telefono}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center">No hay proveedores disponibles</td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>
);

ProductoProveedor.propTypes = {
    proveedores: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
            contacto: PropTypes.string.isRequired,
            telefono: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ProductoProveedor;
