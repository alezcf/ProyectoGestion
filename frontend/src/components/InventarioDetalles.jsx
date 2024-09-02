import React from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Pagination, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/Inventario.css';
import '../css/Buttons.css';

const BASE_URL = import.meta.env.VITE_BASE_URL.replace('/api', '');

const InventarioDetalles = ({ selectedData, currentPage, setCurrentPage }) => {
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = selectedData.productos.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(selectedData.productos.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInfoClick = (productoId) => {
        navigate(`/producto/${productoId}`);
    };

    return (
        <>
        <div className="table-responsive">
            <Table striped bordered hover responsive="md" className="inventario-table">
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th>Contenido</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Imagen</th>
                <th>Tipo</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((producto, index) => {
                const imageUrl = producto.productoId.imagen.replace('src', '');
                return (
                    <tr key={index}>
                    <td>{producto.productoId.nombre}</td>
                    <td>{producto.productoId.descripcion}</td>
                    <td>{producto.productoId.marca}</td>
                    <td>{`${producto.productoId.cantidad} ${producto.productoId.unidadMedida}`}</td>
                    <td>{producto.productoId.precio}</td>
                    <td>{producto.cantidad}</td>
                    <td>{producto.productoId.categoria}</td>
                    <td>
                        <Image
                        className="producto-imagen"
                        src={`${BASE_URL}${imageUrl}`}
                        alt={producto.nombre}
                        fluid
                        />
                    </td>
                    <td>{producto.productoId.tipo}</td>
                    <td>
                        <Button
                        variant="link"
                        onClick={() => handleInfoClick(producto.productoId._id)}
                        title="Información"
                        className="icon-info"
                        style={{ padding: '0' }}
                        >
                        <i className="fa-solid fa-info"></i>
                        </Button>
                        <Button
                        variant="link"
                        onClick={() => handleExportClick(producto)}
                        title="Exportar a Excel"
                        className="icon-excel"
                        style={{ padding: '0' }}
                        >
                        <i className="fa-solid fa-file-excel"></i>
                        </Button>
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </Table>
        </div>
        <Pagination className="pagination">
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                {number + 1}
            </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
        </>
    );
};

InventarioDetalles.propTypes = {
    selectedData: PropTypes.shape({
        productos: PropTypes.array.isRequired,
        maximoStock: PropTypes.number.isRequired,
        fechaIngreso: PropTypes.string.isRequired,
        fechaActualizacion: PropTypes.string.isRequired,
    }).isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
};

export default InventarioDetalles;
