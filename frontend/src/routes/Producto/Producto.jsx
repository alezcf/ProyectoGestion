import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productoService from '../../services/producto.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import { Container, Row, Col, Spinner, Alert, Button, Collapse, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProductoImagen from '../../components/Common/LoadImage';
import ProductoDetalles from '../../components/Producto/ProductoDetalles';
import ProductoCaracteristicas from '../../components/Producto/ProductoCaracteristicas';
import ProductoBotones from '../../components/Common/ButtonsActions';
import productoFields from '../../fields/producto.fields';
import ProductoProveedor from '../../components/Producto/ProductoProveedor';
import ProductoInventario from '../../components/Producto/ProductoInventario';
import DefaultEditModal from '../../components/Common/DefaultEditModal';
import productoProveedorService from '../../services/productoProveedor.service';
import productoInventarioService from '../../services/productoInventario.service';
import '../../css/Form.css';
import '../../css/Producto.css';
import '../../css/Modal.css';

const Producto = () => {
    const { productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDetalles, setOpenDetalles] = useState(true);
    const [openProveedores, setOpenProveedores] = useState(false);
    const [openInventarios, setOpenInventarios] = useState(false);

    // Mover fetchProducto fuera del useEffect para poder reutilizarlo
    const fetchProducto = async () => {
        try {
            const data = await productoService.getProducto(productoId);
            setProducto(data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar el producto.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducto();
    }, [productoId]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleExport = async () => {
        try {
            // Estructura para exportar el producto
            const productoData = {
                NOMBRE: producto.nombre,
                DESCRIPCIÓN: producto.descripcion,
                MARCA: producto.marca,
                CONTENIDO: producto.contenido,
                'UNIDAD DE MEDIDA': producto.unidad_medida,
                TIPO: producto.tipo,
                PRECIO: producto.precio,
                'CATEGORÍA': producto.categoria || 'No registrada',
            };

            // Obtener proveedores asociados al producto desde el servicio
            const proveedoresData = await productoProveedorService.getProveedoresByProducto(producto.id);

            // Mapea solo la información del proveedor, excluyendo los datos del producto
            const proveedoresExport = proveedoresData.map(relacion => ({
                NOMBRE: relacion.proveedor?.nombre || 'No disponible',
                RUT: relacion.proveedor?.rut || 'No disponible',
                DIRECCIÓN: relacion.proveedor?.direccion || 'No disponible',
                TELÉFONO: relacion.proveedor?.telefono || 'No disponible',
                EMAIL: relacion.proveedor?.email || 'No disponible',
            }));

            // Obtener inventarios asociados al producto desde el servicio
            const inventariosData = await productoInventarioService.getInventariosByProducto(producto.id);

            // Mapea solo la información del inventario, excluyendo los datos del producto
            const inventariosExport = inventariosData.map(inventarioRelacion => ({
                NOMBRE: inventarioRelacion.inventario?.nombre || 'No disponible',
                CANTIDAD: inventarioRelacion.cantidad || 0,
                'MÁXIMO STOCK': inventarioRelacion.inventario?.maximo_stock || 'No disponible',
                'FECHA DE ACTUALIZACIÓN': inventarioRelacion.inventario?.ultima_actualizacion || 'No disponible',
            }));

            // Nombres personalizados para las hojas de Excel
            const sheetNames = {
                mainSheet: "Producto",       // Nombre de la hoja principal (datos del producto)
                arraySheet1: "Proveedores",  // Nombre de la hoja para proveedores
                arraySheet2: "Inventarios"   // Nombre de la hoja para inventarios
            };

            // Llamar al servicio de exportación para generar el archivo Excel con nombres de hoja personalizados
            await exportService.exportObjectAndArraysToExcel(productoData, [proveedoresExport, inventariosExport], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del producto:', error);
            alert('Error al exportar los datos.');
        }
    };




    const handleFormSubmit = async (data) => {
        const productoActualizado = { ...producto, ...data };
        console.log('Producto actualizado:', productoActualizado);
        try {
            await productoService.updateProducto(productoActualizado);
            console.log('Producto actualizado con éxito:', productoActualizado);
            setShowEditModal(false);

            // Llamar nuevamente a fetchProducto para obtener los datos actualizados
            fetchProducto();

        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const toggleDetalles = () => {
        setOpenDetalles(true);
        setOpenProveedores(false);
        setOpenInventarios(false);
    };

    const toggleProveedores = () => {
        setOpenProveedores(true);
        setOpenDetalles(false);
        setOpenInventarios(false);
    };

    const toggleInventarios = () => {
        setOpenInventarios(true);
        setOpenDetalles(false);
        setOpenProveedores(false);
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando producto...
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    const proveedores = producto?.productoProveedores?.map(proveedorRelacion => {
        const { proveedor } = proveedorRelacion;
        return {
            id: proveedor.id,
            nombre: proveedor.nombre,
            rut: proveedor.rut,
            direccion: proveedor.direccion,
            telefono: proveedor.telefono,
            email: proveedor.email
        };
    }) || [];

    const inventarios = producto?.productoInventarios?.map(inventarioRelacion => {
        const { inventario } = inventarioRelacion;
        return {
            id: inventarioRelacion.id,
            cantidad: inventarioRelacion.cantidad,
            inventario: {
                id: inventario.id,
                nombre: inventario.nombre,
                maximo_stock: inventario.maximo_stock,
                ultima_actualizacion: inventario.ultima_actualizacion
            }
        };
    }) || [];

    return (
        <Container fluid className="form-container">
            <Row className="my-4">
                <Col md={4}>
                    <center><h1><ProductoDetalles producto={producto} /></h1></center>
                    <ProductoImagen productoId={productoId} imagenRuta={producto?.imagen_ruta} />
                    <h1><ProductoBotones onEdit={handleEdit} onExport={handleExport} /></h1>
                </Col>
                <Col md={8}>
                    {/* Collapse para la tabla de detalles del producto */}
                    <Card className={`mb-3 custom-card ${openDetalles ? 'card-active' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Características generales</h5>
                            <Button
                                onClick={toggleDetalles}
                                aria-controls="detalles-producto"
                                aria-expanded={openDetalles}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openDetalles ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Collapse in={openDetalles}>
                            <div id="detalles-producto">
                                <Card.Body>
                                    <ProductoCaracteristicas producto={producto} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

                    {/* Collapse para la tabla de proveedores */}
                    <Card className={`custom-card ${openProveedores ? 'card-active' : ''} mt-4`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Proveedores</h5>
                            <Button
                                onClick={toggleProveedores}
                                aria-controls="proveedores-producto"
                                aria-expanded={openProveedores}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openProveedores ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Collapse in={openProveedores}>
                            <div id="proveedores-producto">
                                <Card.Body>
                                    <ProductoProveedor producto={producto} proveedores={proveedores} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>

                    {/* Collapse para la tabla de inventarios */}
                    <Card className={`custom-card ${openInventarios ? 'card-active' : ''} mt-4`}>
                        <Card.Header className="d-flex justify-content-between align-items-center card-header-custom">
                            <h5 className="header-title">Inventarios</h5>
                            <Button
                                onClick={toggleInventarios}
                                aria-controls="inventarios-producto"
                                aria-expanded={openInventarios}
                                variant="link"
                                className="toggle-btn"
                            >
                                {openInventarios ? (
                                    <FontAwesomeIcon icon={faChevronUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Button>
                        </Card.Header>
                        <Collapse in={openInventarios}>
                            <div id="inventarios-producto">
                                <Card.Body>
                                    <ProductoInventario producto={producto} inventarios={inventarios} />
                                </Card.Body>
                            </div>
                        </Collapse>
                    </Card>
                </Col>
            </Row>

            {/* Modal para editar el producto usando DefaultEditModal */}
            <DefaultEditModal
                show={showEditModal}
                handleClose={handleCloseModal}
                fields={productoFields}
                defaultValues={producto}
                onSubmit={handleFormSubmit}
                title="EDITAR PRODUCTO"
            />

        </Container>
    );
};

export default Producto;
