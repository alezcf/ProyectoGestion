import React from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination, Button} from 'react-bootstrap';
import { formatRut } from '../logic/format.logic.js';
import '../css/Usuarios.css';

const UsuariosDetalles = ({ usuarios, currentPage, setCurrentPage }) => {
    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = usuarios.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(usuarios.length / itemsPerPage);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInfoClick = (productoId) => {
        navigate(`/producto/${productoId}`);
    };

    return (
        <>
            <div className="table-responsive">
                <Table striped bordered hover className="inventario-table">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((usuario, index) => (
                            <tr key={index}>
                                <td>{formatRut(usuario.rut)}</td> {/* Formatea el RUT */}
                                <td>{usuario.username}</td>
                                <td>{usuario.email}</td>
                                <td>
                                    {usuario.roles.map((rol, rolIndex) => (
                                        <span key={rolIndex}>
                                            {rol.name}
                                            {rolIndex < usuario.roles.length - 1 && ', '}
                                        </span>
                                    ))}
                                </td>
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
                                    title="Editar"
                                    className="icon-update"
                                    style={{ padding: '0' }}
                                    >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Pagination className="pagination">
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map((number) => (
                    <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => handlePageChange(number + 1)}
                    >
                        {number + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        </>
    );
};

UsuariosDetalles.propTypes = {
    usuarios: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
};

export default UsuariosDetalles;
