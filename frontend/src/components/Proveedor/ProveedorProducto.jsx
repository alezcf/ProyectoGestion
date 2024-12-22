import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse, Card, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import SecondaryTable from '../../components/Common/SecondaryTable';
import ProductoProveedor from '../../services/productoProveedor.service';
import '../../css/Buttons.css';

const ProveedorProducto = ({ proveedorId }) => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]); // Productos asociados
    const [openProductos, setOpenProductos] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {

                const productosResponse = await ProductoProveedor.getProductosByProveedor(proveedorId);
                setProductos(productosResponse?.data?.data || []);

                setLoading(false);
            } catch (err) {
                setError('Error al cargar los productos asociados.');
                setLoading(false);
            }
        };

        fetchProductos();
    }, [proveedorId]);


    const toggleProductos = () => {
        setOpenProductos(!openProductos);
    };

    if (loading) {
        return (
            <Card className="custom-card mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                    <h5 className="header-title">Productos Relacionados</h5>
                </Card.Header>
                <Card.Body className="text-center">
                    <Spinner animation="border" variant="primary" /> Cargando productos...
                </Card.Body>
            </Card>
        );
    }

    const handleInfoProducto = (productoId) => {
        navigate(`/producto/${productoId}`);
    };

    if (error) {
        return (
            <Card className="custom-card mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                    <h5 className="header-title">Productos Relacionados</h5>
                </Card.Header>
                <Card.Body>
                    <Alert variant="warning" className="text-center">No hay productos asociados.</Alert>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className={`custom-card ${openProductos ? 'card-active' : ''} mt-4`}>
            <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                <h5 className="header-title">Productos Relacionados</h5>
                <Button
                    onClick={toggleProductos}
                    aria-controls="productos-proveedor"
                    aria-expanded={openProductos}
                    variant="link"
                    className="toggle-btn"
                >
                    {openProductos ? (
                        <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                        <FontAwesomeIcon icon={faChevronDown} />
                    )}
                </Button>
            </Card.Header>
            <Collapse in={openProductos}>
                <div id="productos-proveedor">
                    <Card.Body>
                        {productos.length > 0 ? (
                            <SecondaryTable
                                headers={["Nombre", "Descripción", "Categoría", "Acciones"]}
                                data={productos}
                                renderRow={(producto) => (
                                    <tr key={producto.id}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>{producto.categoria}</td>
                                        <td>
                                            <button type="button" className="button btn-info" onClick={() => handleInfoProducto(producto.id)}>
                                                <InfoCircle />
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            />
                        ) : (
                            <Alert variant="warning" className="text-center">No hay productos asociados.</Alert>
                        )}
                    </Card.Body>
                </div>
            </Collapse>
        </Card>
    );
};

ProveedorProducto.propTypes = {
    proveedorId: PropTypes.number.isRequired,
};

export default ProveedorProducto;
