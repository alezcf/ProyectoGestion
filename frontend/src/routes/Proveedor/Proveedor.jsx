import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import proveedorService from '../../services/proveedor.service';
import { Container, Row, Col, Spinner, Alert, Form, Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ProveedorDetalles from '../../components/Proveedor/ProveedorDetalles';
import ButtonsActions from '../../components/Common/ButtonsActions';
import proveedorFields from '../../fields/proveedor.fields'; // Importamos los campos de validación

const Proveedor = () => {
    const { proveedorId } = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Configuración de useForm para manejar el formulario de edición
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const response = await proveedorService.getProveedor(proveedorId);

                if (response) {
                    setProveedor(response);
                    reset(response); // Resetea el formulario con los datos del proveedor
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
    }, [proveedorId, reset]);

    const handleEdit = () => {
        setShowEditModal(true); // Muestra el modal de edición
    };

    const handleExport = () => {
        console.log("Exportar los datos del proveedor");
    };

    const handleFormSubmit = (data) => {
        console.log('Datos actualizados:', data);
        setShowEditModal(false);  // Cierra el modal al enviar
        // Implementar lógica para guardar los datos editados del proveedor
    };

    const handleCloseModal = () => {
        setShowEditModal(false);  // Cierra el modal sin guardar
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
                    />
                </Col>
            </Row>

            {/* Modal para editar los datos del proveedor */}
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Proveedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(handleFormSubmit)}>
                        {proveedorFields.map((field, index) => (
                            <Form.Group controlId={field.name} key={index}>
                                <Form.Label>{field.label}</Form.Label>
                                <Form.Control
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.name, field.validation)}  // Registra el campo con validaciones
                                />
                                {errors[field.name] && (
                                    <Alert variant="danger">{errors[field.name].message}</Alert>  // Muestra errores de validación
                                )}
                            </Form.Group>
                        ))}

                        <Button variant="primary" type="submit">
                            Guardar cambios
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Proveedor;
