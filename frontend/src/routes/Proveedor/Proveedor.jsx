import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service'; // Importa el servicio para obtener los datos
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProveedorDetalles from '../../components/Proveedor/ProveedorDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions'; // Importamos el componente

const Proveedor = () => {
    const { proveedorId } = useParams();
    const [proveedor, setProveedor] = useState(null); // Inicializa el estado como null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const response = await proveedorService.getProveedor(proveedorId);

                if (response) {
                    setProveedor(response); // Asigna los datos solo si existen
                } else {
                    setError('Proveedor no encontrado.');
                }
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos del proveedor.');
                setLoading(false);
            }
        };

        fetchProveedor();
    }, [proveedorId]);

    const handleEdit = () => {
        console.log("Editar los datos del proveedor");
    };

    const handleExport = () => {
        console.log("Exportar los datos del proveedor");
        // Implementar lógica de exportación aquí
    };

    if (loading) {
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="primary" /> Cargando proveedor...
            </Container>
        );
    }

    if (error || !proveedor) {
        return (
            <Container className="text-center">
                <Alert variant="danger">{error || 'Proveedor no encontrado.'}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="my-4">
                <Col md={4}>
                    <ProveedorDetalles proveedor={proveedor} />
                    <ButtonsActions
                        itemId={proveedor.id}
                        itemName={proveedor.nombre}
                        onEdit={handleEdit}
                        onExport={handleExport}
                        detailsRoute="/proveedor"
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Proveedor;
