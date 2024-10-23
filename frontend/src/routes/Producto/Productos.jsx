import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import productoService from '../../services/producto.service';
import exportService from '../../services/export.service'; // Importamos el servicio de exportación
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import ProductoAcciones from '../../components/Producto/ProductoAcciones';

const BASE_URL = import.meta.env.VITE_BASE_URL;  // Base URL del backend

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await productoService.getAllProductos();
                setProductos(data || []); // Asegura que siempre haya un array
                console.log(productos);
            } catch (err) {
                console.error('Error al cargar los productos.', err);
                setProductos([]); // En caso de error, asegurarse de que productos sea un array vacío
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
            console.log('Datos a exportar:', productosData);
            const filePath = await exportService.exportDataToExcel(productosData);
            console.log('Archivo Excel exportado:', filePath);
            alert('Datos exportados con éxito. Archivo disponible en: ' + filePath);
        } catch (error) {
            console.error('Error exportando a Excel:', error);
            alert('Error al exportar los datos.');
        }
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Añadimos una nueva columna para la imagen
    const headers = ['Nombre', 'Marca', 'Categoría', 'Precio', 'Contenido', 'Imagen', 'Acciones'];

    const renderRow = (producto, index) => (
        <tr key={index}>
            <td>{producto.nombre}</td>
            <td>{producto.marca}</td>
            <td>{producto.categoria}</td>
            <td>{producto.precio}</td>
            <td>{producto.contenido} {producto.unidad_medida}</td>
            {/* Renderizamos la imagen directamente desde el backend */}
            <td>
                <Image
                    src={`${BASE_URL}${producto.imagen_ruta}`} // Obtenemos la imagen desde el backend
                    alt={`Imagen de ${producto.nombre}`}
                    fluid
                    style={{
                        width: '50px', // Definir el tamaño pequeño de la imagen
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '5px'
                    }}
                    onError={(e) => {
                        // Mostrar imagen por defecto si falla la carga de la imagen
                        e.target.src = '../images/NoExiste.png';
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
                        <>
                            <SearchBar
                                searchQuery={searchQuery}
                                handleSearchChange={handleSearchChange}
                            />
                            <CustomTable
                                headers={headers}
                                data={filteredProductos}
                                renderRow={renderRow}
                                emptyMessage="No hay productos disponibles." // Mensaje cuando no hay productos
                            />
                            {/* Botones para crear nuevo producto e inventario */}
                            <div className="mt-3">
                                <Button variant="primary" onClick={handleExport}>Exportar a Excel</Button>
                                <Link to="/crear-producto">
                                    <Button variant="success" className="me-2">Crear Producto</Button>
                                </Link>
                            </div>
                        </>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
};

export default Productos;
