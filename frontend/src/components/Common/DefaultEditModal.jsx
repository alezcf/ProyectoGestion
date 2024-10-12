import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPaperPlane, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import '../../css/Modal.css';

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
            <Modal.Header className="modal-header-purple modal-header-centered" closeButton>
                <Modal.Title className="modal-title-custom">
                    <FontAwesomeIcon icon={faUserPen} /> {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <Form onSubmit={handleSubmit(submitForm)}>
                    {fields.map((field, index) => (
                        <Form.Group controlId={field.name} key={index} className="form-group-custom">
                            <Form.Label><strong>{field.label}</strong></Form.Label>
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

                    <div className="button-container">
                            <button type="button" className="button-previous" onClick={handleClose}>
                                CANCELAR
                            </button>
                            <button type="submit" className="button-next">
                                GUARDAR <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
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
