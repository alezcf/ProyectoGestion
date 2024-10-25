import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import usuarioService from '../../services/usuario.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatDateToDDMMYYYY } from '../../logic/dateFormat.logic';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await usuarioService.getAllUsuarios();
                setUsuarios(data);
                console.log(data);
            } catch (err) {
                setError('Error al cargar los usuarios.');
            }
        };

        fetchUsuarios();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleExport = async () => {
        try {
            const usuariosData = usuarios.map(usuario => ({
                NOMBRE: usuario.nombreCompleto,
                RUT: usuario.rut,
                'CORREO ELECTRÓNICO': usuario.email,
                ROL: usuario.rol,
                REGISTRO: formatDateToDDMMYYYY(usuario.createdAt)
            }));
            console.log('Datos a exportar:', usuariosData);
            const filePath = await exportService.exportDataToExcel(usuariosData);
            console.log('Archivo Excel exportado:', filePath);
            alert('Datos exportados con éxito. Archivo disponible en: ' + filePath);
        } catch (error) {
            console.error('Error exportando a Excel:', error);
            alert('Error al exportar los datos.');
        }
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
                    <div className="button-container mt-3">
                        <Link to="/crear-usuario" className="button-left">
                            <Button variant="success">
                                <FontAwesomeIcon icon={faPlus} /> Crear Usuario
                            </Button>
                        </Link>

                        <Button variant="primary" onClick={handleExport} className="button-right">
                            Exportar a Excel
                        </Button>
                    </div>

                </Card>
            </Row>

        </Container>
    );
};

export default Usuarios;
