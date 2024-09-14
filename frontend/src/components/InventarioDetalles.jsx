import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { FileEarmarkExcel, InfoCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom'; 
import '../css/Inventario.css';
import '../css/Buttons.css';

const BASE_URL = import.meta.env.VITE_BASE_URL; 

const InventarioDetalles = ({ selectedData }) => {

    const handleExportClick = (productoNombre) => {
        console.log(`Exportando datos del producto: ${productoNombre}`);
    };

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
                        const producto = productoInventario.producto;
                        const rutaImagen = producto.imagen_ruta ? 
                            producto.imagen_ruta.replace(/\\/g, '/') : null;
                        
                        return (
                            <tr key={index}>
                                <td>{producto.nombre}</td>
                                <td>{producto.categoria}</td>
                                <td>{producto.marca}</td>
                                <td>{productoInventario.cantidad} {producto.unidad_medida}</td>
                                <td>${producto.precio}</td>
                                <td>
                                    <img 
                                        src={rutaImagen ? `${BASE_URL}${rutaImagen}` : '/images/NoExiste.png'} 
                                        alt={rutaImagen ? 'Imagen del producto' : 'Imagen no disponible'} 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                    />
                                </td>
                                <td>
                                    
                                    <Link 
                                        to={`/producto/${producto.id}`} // Usamos Link para redirigir
                                        className="button btn-info"
                                    >
                                        <InfoCircle />
                                    </Link>

                                    <button 
                                        type="submit" 
                                        className="button btn-success"
                                        onClick={() => handleExportClick(producto.nombre)} // Console log
                                    >
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
                id: PropTypes.number.isRequired,
                nombre: PropTypes.string.isRequired,
                categoria: PropTypes.string,
                marca: PropTypes.string,
                cantidad: PropTypes.string,
                unidad_medida: PropTypes.string,
                precio: PropTypes.string,
                imagen_ruta: PropTypes.string,
            }).isRequired,
        })).isRequired,
    }).isRequired,
};

export default InventarioDetalles;
