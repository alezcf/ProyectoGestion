import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import usuarioService from '../../services/usuario.service';
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';
import { Link } from "react-router-dom"; // Importamos el componente ButtonsActions
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic'; // Importamos la función de formateo

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await usuarioService.getAllUsuarios();
                setUsuarios(data);
            } catch (err) {
                setError('Error al cargar los usuarios.');
            }
        };

        fetchUsuarios();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = (usuarioNombre) => {
        console.log(`Exportando datos del usuario: ${usuarioNombre}`);
        // Implementar la lógica de exportación aquí
    };

    const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = ['Nombre Completo', 'RUT', 'Email', 'Rol', 'Fecha de Registro', 'Acciones'];

    const renderRow = (usuario, index) => (
        <tr key={index}>
            <td>{usuario.nombreCompleto}</td>
            <td>{usuario.rut}</td>
            <td>{usuario.email}</td>
            <td>{usuario.rol}</td>
            <td>{formatDateToDDMMYYYY(usuario.createdAt)}</td> {/* Formatear la fecha de registro */}
            <td>
                <ButtonsActionsTable
                    itemId={`${usuario.id}`}  // ID del usuario
                    itemName={usuario.nombreCompleto}  // Nombre del usuario
                    onExport={handleExport}  // Función de exportación
                    detailsRoute={`/usuario`}  // Ruta dinámica con el ID del usuario
                />
            </td>
        </tr>
    );

    return (
        <Container fluid className="usuarios-container mt-2">
            <div className="inventario-header">
                <h1>Usuarios</h1>
            </div>
            <Row className="justify-content-md-center">
                <Card className="w-100">
                    <Card.Body>
                        {error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
                                <CustomTable headers={headers} data={filteredUsuarios} renderRow={renderRow} />
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Row>
            <div className="mt-3">
                <Link to="/crear-usuario">
                    <Button variant="success">Crear Usuario</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Usuarios;
