import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductoCaracteristicas = ({ producto }) => (
    <div>
        <Table striped bordered hover responsive>
            <tbody style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Descripción</td>
                    <td style={{ textAlign: 'left' }}>{producto.descripcion || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Categoría</td>
                    <td style={{ textAlign: 'left' }}>{producto.categoria || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Tipo</td>
                    <td style={{ textAlign: 'left' }}>{producto.tipo || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Contenido</td>
                    <td style={{ textAlign: 'left' }}>{producto.contenido ? `${producto.contenido}` : 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Unidad de medida</td>
                    <td style={{ textAlign: 'left' }}>{producto.unidad_medida ? producto.unidad_medida.toUpperCase() : 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Código</td>
                    <td style={{ textAlign: 'left' }}>{producto.codigo || 'No hay registro'}</td>
                </tr>
                <tr>
                    <td style={{ color: 'black', textAlign: 'left', fontWeight: 'bold' }}>Precio</td>
                    <td style={{ textAlign: 'left' }}>{producto.precio ? `$${producto.precio}` : 'No hay registro'}</td>
                </tr>
            </tbody>
        </Table>
    </div>
);

ProductoCaracteristicas.propTypes = {
    producto: PropTypes.shape({
        descripcion: PropTypes.string,
        categoria: PropTypes.string,
        tipo: PropTypes.string,
        contenido: PropTypes.string,
        unidad_medida: PropTypes.string,
        codigo: PropTypes.string,
        precio: PropTypes.string,
    }).isRequired,
};

export default ProductoCaracteristicas;