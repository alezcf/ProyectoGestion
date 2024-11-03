import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productoService from '../../services/producto.service';
import productoProveedorService from '../../services/productoProveedor.service';
import productoInventarioService from '../../services/productoInventario.service';
import exportService from '../../services/export.service';
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import ProductoAcciones from '../../components/Producto/ProductoAcciones';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await productoService.getAllProductos();
                setProductos(data || []);
                setError(null); // Restablece el error si la solicitud es exitosa
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message); // Mensaje del backend
                } else {
                    setError('Error de red. Verifique su conexión.'); // Error de red u otra excepción
                }
                setProductos([]); // Asegura un array vacío en caso de error
            }
        };

        fetchProductos();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = async () => {
        try {
            const productosData = productos.map(producto => ({
                NOMBRE: producto.nombre,
                MARCA: producto.marca,
                CATEGORÍA: producto.categoria,
                PRECIO: producto.precio,
                CONTENIDO: producto.contenido,
                'UNIDAD DE MEDIDA': producto.unidad_medida
            }));
            const filePath = await exportService.exportDataToExcel(productosData);
            alert('Datos exportados con éxito. Archivo disponible en: ' + filePath);
        } catch (error) {
            console.error('Error exportando a Excel:', error);
            alert('Error al exportar los datos.');
        }
    };

    const handleExportProductoIndividual = async (producto) => {
        try {
            // Estructura para exportar los datos del producto
            const productoData = {
                NOMBRE: producto.nombre,
                DESCRIPCIÓN: producto.descripcion,
                MARCA: producto.marca,
                CONTENIDO: producto.contenido,
                'UNIDAD DE MEDIDA': producto.unidad_medida,
                TIPO: producto.tipo,
                PRECIO: producto.precio,
                CATEGORÍA: producto.categoria || 'No registrada',
            };

            // Obtener proveedores asociados al producto
            const proveedoresData = await productoProveedorService.getProveedoresByProducto(producto.id);
            const proveedoresExport = proveedoresData.map(relacion => ({
                NOMBRE: relacion.proveedor?.nombre || 'No disponible',
                RUT: relacion.proveedor?.rut || 'No disponible',
                DIRECCIÓN: relacion.proveedor?.direccion || 'No disponible',
                TELÉFONO: relacion.proveedor?.telefono || 'No disponible',
                EMAIL: relacion.proveedor?.email || 'No disponible',
            }));

            // Obtener inventarios asociados al producto
            const inventariosData = await productoInventarioService.getInventariosByProducto(producto.id);
            const inventariosExport = inventariosData.map(inventarioRelacion => ({
                NOMBRE: inventarioRelacion.inventario?.nombre || 'No disponible',
                CANTIDAD: inventarioRelacion.cantidad || 0,
                'MÁXIMO STOCK': inventarioRelacion.inventario?.maximo_stock || 'No disponible',
                'FECHA DE ACTUALIZACIÓN': inventarioRelacion.inventario?.ultima_actualizacion || 'No disponible',
            }));

            // Nombres personalizados para las hojas de Excel
            const sheetNames = {
                mainSheet: "Producto",
                arraySheet1: "Proveedores",
                arraySheet2: "Inventarios"
            };

            await exportService.exportObjectAndArraysToExcel(productoData, [proveedoresExport, inventariosExport], sheetNames);
            alert('Datos exportados con éxito');
        } catch (error) {
            console.error('Error exportando los datos del producto:', error);
            alert('Error al exportar los datos.');
        }
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = ['Nombre', 'Marca', 'Categoría', 'Precio', 'Contenido', 'Imagen', 'Acciones'];

    const renderRow = (producto, index) => (
        <tr key={index}>
            <td>{producto.nombre}</td>
            <td>{producto.marca}</td>
            <td>{producto.categoria}</td>
            <td>{producto.precio}</td>
            <td>{producto.contenido} {producto.unidad_medida}</td>
            <td>
                <img
                    src={`${BASE_URL}${producto.imagen_ruta}`}
                    alt={`Imagen de ${producto.nombre}`}
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '5px'
                    }}
                    onError={(e) => {
                        e.target.src = '../images/NoExiste.png'; // Imagen de respaldo si la imagen no se encuentra
                    }}
                />
            </td>
            <td>
                <ProductoAcciones
                    productoId={producto.id}
                    producto={producto}
                    onExport={handleExportProductoIndividual}
                />
            </td>
        </tr>
    );

    return (
        <Container fluid className="producto-container mt-2">
            <div className="inventario-header">
                <h1>Productos</h1>
            </div>
            <Row className="justify-content-md-center">
                <Card className="w-100">
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger" className="text-center">
                                {error}
                            </Alert>
                        ) : (
                            <>
                                <SearchBar
                                    searchQuery={searchQuery}
                                    handleSearchChange={handleSearchChange}
                                />
                                <CustomTable
                                    headers={headers}
                                    data={filteredProductos}
                                    renderRow={renderRow}
                                    emptyMessage="No hay productos disponibles."
                                />
                            </>
                        )}
                        <div className="button-container mt-3">
                            {/* Botón Crear Producto con estilos de Bootstrap y texto en negrita */}
                            <Link to="/crear-producto" className="button-left">
                                <Button variant="warning" className="btn-create" style={{ fontWeight: 'bold' }}>
                                    <FontAwesomeIcon icon={faPlus} /> CREAR PRODUCTO
                                </Button>
                            </Link>

                            {/* Botón Exportar a Excel para Producto con texto en negrita y borde simulado */}
                            <Button
                                variant="success"
                                onClick={handleExport}
                                className="button-right"
                                disabled={!!error} // Desactiva si hay un error
                                style={{
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '1px 1px 1px black, -1px -1px 1px black',
                                }}
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> EXPORTAR A EXCEL
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Productos;
