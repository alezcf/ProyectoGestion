import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse, Card, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import { InfoCircle } from 'react-bootstrap-icons';
import SecondaryTable from '../../components/Common/SecondaryTable';
import '../../css/Buttons.css';

const ProveedorProducto = ({ productos, allProductos, onProductosChange }) => {
    const [nuevoProductoId, setNuevoProductoId] = useState('');
    const [openProductos, setOpenProductos] = useState(false);

    const handleAddProducto = async () => {
        if (!nuevoProductoId) return;
        try {
            const nuevoProducto = allProductos.find(producto => producto.id === parseInt(nuevoProductoId));
            if (nuevoProducto) {
                const updatedProductos = [...productos, nuevoProducto];
                onProductosChange(updatedProductos);
                setNuevoProductoId('');
                alert('Producto agregado correctamente.');
            }
        } catch (err) {
            alert('Error al agregar el producto.');
            console.error(err);
        }
    };

    const handleDeleteProducto = (productoId) => {
        try {
            const updatedProductos = productos.filter(producto => producto.id !== productoId);
            onProductosChange(updatedProductos);
            alert('Producto eliminado correctamente.');
        } catch (err) {
            alert('Error al eliminar el producto.');
            console.error(err);
        }
    };

    const toggleProductos = () => {
        setOpenProductos(!openProductos);
    };

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
                                headers={["Nombre", "Descripción", "Categoría", "Precio", "Acciones"]}
                                data={productos}
                                renderRow={(producto) => (
                                    <tr key={producto.id}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>{producto.categoria}</td>
                                        <td>{producto.precio}</td>
                                        <td>
                                        <button type="button" className="button btn-info" onClick={() => handleInfo(inventario.id)}>
                                            <InfoCircle />
                                        </button>
                                        <button type="button" className="button btn-edit" onClick={() => handleEditClick({ idRelacion, inventario, cantidad })}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button type="button" className="button btn-delete" onClick={() => handleDelete(idRelacion)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        </td>
                                    </tr>
                                )}
                            />
                        ) : (
                            <Alert variant="warning">No hay productos asociados.</Alert>
                        )}

                        {/* Formulario para agregar productos */}
                        <Form className="d-flex align-items-center mt-3">
                            <Form.Control
                                as="select"
                                value={nuevoProductoId}
                                onChange={(e) => setNuevoProductoId(e.target.value)}
                            >
                                <option value="">Seleccione un producto</option>
                                {allProductos.map((producto) => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </Form.Control>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={handleAddProducto}
                                className="ml-2"
                            >
                                Agregar Producto
                            </Button>
                        </Form>
                    </Card.Body>
                </div>
            </Collapse>
        </Card>
    );
};

ProveedorProducto.propTypes = {
    productos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
            categoria: PropTypes.string,
            precio: PropTypes.number,
        })
    ).isRequired,
    allProductos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ).isRequired,
    onProductosChange: PropTypes.func.isRequired,
    proveedorId: PropTypes.number.isRequired,
};

export default ProveedorProducto;
