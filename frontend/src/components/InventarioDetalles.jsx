import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'react-bootstrap';
import { FileEarmarkExcel, InfoCircle } from 'react-bootstrap-icons';
import '../css/Inventario.css';
import '../css/Buttons.css';

// BASE_URL = BACKEND_URL
const BASE_URL = 'http://localhost:3000/'; 

const InventarioDetalles = ({ selectedData }) => {
    return (
        <div className="table-responsive">
            <Table striped bordered hover responsive="md" className="inventario-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Categoria</th>
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
                        const rutaImagen = productoInventario.producto.imagen_ruta ? 
                            productoInventario.producto.imagen_ruta.replace(/\\/g, '/') : null;
                        
                        return (
                            <tr key={index}>
                                <td>{productoInventario.producto.nombre}</td>
                                <td>{productoInventario.producto.categoria}</td>
                                <td>{productoInventario.producto.marca}</td>
                                <td>{productoInventario.cantidad} {productoInventario.producto.unidad_medida}</td>
                                <td>${productoInventario.producto.precio}</td>
                                <td>
                                    {rutaImagen && (
                                        <img 
                                            src={`${BASE_URL}${rutaImagen}`} 
                                            alt={productoInventario.producto.nombre}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                        />
                                    )}
                                </td>
                                <td>
                                    <button type="submit" className="button btn-info ">
                                        <InfoCircle />
                                    </button>
                                    <button type="submit" className="button btn-success ">
                                        <FileEarmarkExcel />
                                    </button>
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
                categoria: PropTypes.string,
                marca: PropTypes.string,
                cantidad: PropTypes.number,
                unidad_medida: PropTypes.string,
                precio: PropTypes.number,
                imagen_ruta: PropTypes.string,
            }).isRequired,
        })).isRequired,
    }).isRequired,
};

export default InventarioDetalles;
