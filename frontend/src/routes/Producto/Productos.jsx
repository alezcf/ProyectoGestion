import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productoService from '../../services/producto.service';
import exportService from '../../services/export.service';
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
                    // Mensaje del backend
                    setError(err.response.data.message);
                } else {
                    // Error de red u otra excepción
                    setError('Error de red. Verifique su conexión.');
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
        src={`${BASE_URL}${producto.imagen_ruta}`} // Ruta completa de la imagen desde el backend
        alt={`Imagen de ${producto.nombre}`}
        style={{
            width: '50px', // Tamaño de la imagen
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
                    productoNombre={producto.nombre}
                    onExport={handleExport}
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
                            <Link to="/crear-producto" className="button-left">
                                <Button variant="success" className="me-2">
                                    <FontAwesomeIcon icon={faPlus} /> Crear Producto
                                </Button>
                            </Link>

                            <Button variant="primary" onClick={handleExport} className="button-right" disabled={!!error}>
                                Exportar a Excel
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Productos;
