import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

const ProductoDetallesInfo = ({ producto }) => {
    return (
        <Col md={8} className="producto-detalles-info">
            <Row className="atributo">
                <Col md={6}>
                    <h3>Nombre</h3>
                    <p>{producto.nombre}</p>
                </Col>
                <Col md={6}>
                    <h3>Descripción</h3>
                    <p>{producto.descripcion}</p>
                </Col>
            </Row>
            <Row className="atributo">
                <Col md={6}>
                    <h3>Marca</h3>
                    <p>{producto.marca}</p>
                </Col>
                <Col md={6}>
                    <h3>Precio</h3>
                    <p>${producto.precio}</p>
                </Col>
            </Row>
            <Row className="atributo">
                <Col md={6}>
                    <h3>Volumen</h3>
                    <p>{producto.cantidad} {producto.unidadMedida}</p>
                </Col>
                <Col md={6}>
                    <h3>Categoría</h3>
                    <p>{producto.categoria}</p>
                </Col>
            </Row>
            <Row className="atributo">
                <Col md={6}>
                    <h3>Tipo</h3>
                    <p>{producto.tipo}</p>
                </Col>
                <Col md={6}>
                    <h3>Código de Barras</h3>
                    <p>{producto.codigoBarras}</p>
                </Col>
            </Row>
            <Row className="atributo">
                {producto.proveedor && (
                    <Col md={6}>
                        <h3>Proveedor</h3>
                        <p>{producto.proveedor}</p>
                    </Col>
                )}
            </Row>
        </Col>
    );
};

ProductoDetallesInfo.propTypes = {
    producto: PropTypes.object.isRequired,
};

export default ProductoDetallesInfo;
