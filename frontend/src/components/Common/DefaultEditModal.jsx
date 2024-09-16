import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const DefaultEditModal = ({ show, handleClose, fields, defaultValues, onSubmit, title }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues
    });

    const submitForm = (data) => {
        onSubmit(data);
        handleClose(); // Cierra el modal después del submit
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(submitForm)}>
                    {fields.map((field, index) => (
                        <Form.Group controlId={field.name} key={index}>
                            <Form.Label>{field.label}</Form.Label>
                            {field.type === 'select' ? (
                                <Form.Control as="select" {...register(field.name, field.validation)}>
                                    {field.options.map((option, idx) => (
                                        <option key={idx} value={option.value}>{option.label}</option>
                                    ))}
                                </Form.Control>
                            ) : (
                                <Form.Control
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    {...register(field.name, field.validation)}
                                />
                            )}
                            {errors[field.name] && <span className="text-danger">{errors[field.name].message}</span>}
                        </Form.Group>
                    ))}

                    <Button variant="primary" type="submit">
                        Guardar cambios
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

DefaultEditModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        placeholder: PropTypes.string,
        validation: PropTypes.object,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        }))
    })).isRequired,
    defaultValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default DefaultEditModal;
