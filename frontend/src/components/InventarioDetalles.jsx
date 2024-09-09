import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'react-bootstrap';
import '../css/Inventario.css';

// Definir la URL base de tu servidor
const BASE_URL = 'http://localhost:3000/'; // Reemplázalo con tu URL real

const InventarioDetalles = ({ selectedData }) => {
    return (
        <div className="table-responsive">
            <Table striped bordered hover responsive="md" className="inventario-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Marca</th>
                        <th>Contenido</th>
                        <th>Precio</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedData.productoInventarios.map((productoInventario, index) => {
                        // Reemplazar las barras invertidas por barras inclinadas
                        const rutaImagen = productoInventario.producto.imagen_ruta.replace(/\\/g, '/');
                        
                        return (
                            <tr key={index}>
                                <td>{productoInventario.producto.nombre}</td>
                                <td>{productoInventario.producto.descripcion}</td>
                                <td>{productoInventario.producto.marca}</td>
                                <td>{productoInventario.cantidad} {productoInventario.producto.unidad_medida}</td>
                                <td>${productoInventario.producto.precio}</td>
                                <td>
                                    <img 
                                        src={`${BASE_URL}${rutaImagen}`} 
                                        alt={productoInventario.producto.nombre}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                    />
                                </td>
                                <td>
                                    <Button variant="primary" size="sm">Editar</Button>
                                    <Button variant="danger" size="sm" className="ml-2">Eliminar</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

InventarioDetalles.propTypes = {
    selectedData: PropTypes.shape({
        productoInventarios: PropTypes.arrayOf(PropTypes.shape({
            producto: PropTypes.shape({
                nombre: PropTypes.string.isRequired,
                descripcion: PropTypes.string.isRequired,
                marca: PropTypes.string.isRequired,
                cantidad: PropTypes.number.isRequired,
                unidad_medida: PropTypes.string.isRequired,
                precio: PropTypes.number.isRequired,
                imagen_ruta: PropTypes.string.isRequired, // Ruta de la imagen
            }).isRequired,
        })).isRequired,
    }).isRequired,
};

export default InventarioDetalles;
