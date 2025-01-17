import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Alert, Button } from 'react-bootstrap';
import usuarioService from '../../services/usuario.service';
import exportService from '../../services/export.service'; // Importar el servicio de exportación
import CustomTable from '../../components/Common/CustomTable';
import SearchBar from '../../components/Common/SearchBar';
import ButtonsActionsTable from '../../components/Common/ButtonsActionsTable';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExcel } from '@fortawesome/free-solid-svg-icons';
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
                REGISTRO: formatDateToDDMMYYYY(usuario.createdAt),
                "ACTIVO": usuario.isActive ? "Sí" : "No",
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

    const handleExportUsuarioIndividual = async (usuario) => {
    try {
        const dataObject = {
            RUT: usuario.rut,
            EMAIL: usuario.email,
            ROL: usuario.rol,
            "NOMBRE COMPLETO": usuario.nombreCompleto,
            "FECHA DE REGISTRO": formatDateToDDMMYYYY(usuario.createdAt),
            "ÚLTIMA ACTUALIZACIÓN": formatDateToDDMMYYYY(usuario.updatedAt),
            "ACTIVO": usuario.isActive ? "Sí" : "No",
        };
        console.log('Datos del usuario a exportar:', dataObject);
        const sheetNames = {
            mainSheet: "Usuario",
        };

        const arrayData = [
            [
            ]
        ];

        await exportService.exportObjectAndArraysToExcel(dataObject, arrayData, sheetNames);
        alert('Datos del usuario exportados con éxito.');
    } catch (error) {
        console.error('Error al exportar los datos del usuario:', error);
        alert('Error al exportar los datos del usuario.');
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
            <td>{formatDateToDDMMYYYY(usuario.createdAt)}</td>
            <td>
                <ButtonsActionsTable
                    itemId={usuario.id}
                    itemName={usuario.nombreCompleto}
                    onExport={() => handleExportUsuarioIndividual(usuario)}  // Pasar el usuario completo
                    detailsRoute={`/usuario`}
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
                        {/* Botón Crear Usuario con estilos de Bootstrap y texto en negrita */}
                        <Link to="/crear-usuario">
                            <Button variant="warning" className="btn-create" style={{ fontWeight: 'bold' }}>
                                <FontAwesomeIcon icon={faPlus} /> REGISTRAR
                            </Button>
                        </Link>

                        {/* Botón Exportar a Excel para Usuario con texto en negrita */}
                        <Button
                            variant="success"
                            className="button-right"
                            onClick={handleExport}
                            disabled={!!error} // Desactiva si hay un error
                            style={{
                                fontWeight: 'bold',
                                color: 'white',
                                textShadow: '1px 1px 1px black, -1px -1px 1px black', // Borde simulado en negro
                            }}
                        >
                            <FontAwesomeIcon icon={faFileExcel} /> EXPORTAR
                        </Button>

                    </div>

                </Card>
            </Row>

        </Container>
    );
};

export default Usuarios;
