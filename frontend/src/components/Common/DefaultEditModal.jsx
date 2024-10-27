import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format, isValid } from 'date-fns';
import '../../css/Modal.css';

const formatDateToMMDDYYYY = (date) => {
    return isValid(date) ? format(date, 'MM/dd/yyyy') : '';
};

const DefaultEditModal = ({ show, handleClose, fields, defaultValues, onSubmit, title }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues
    });

    const [selectedDate, setSelectedDate] = React.useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const submitForm = (data) => {
        setShowConfirmation(true);
    };

    const confirmSubmit = (data) => {
        const formattedData = { ...data };

        fields.forEach(field => {
            if (field.type === 'date' && selectedDate) {
                formattedData[field.name] = formatDateToMMDDYYYY(selectedDate);
            }
        });

        onSubmit(formattedData);
        handleClose();
        setShowConfirmation(false);
    };

    React.useEffect(() => {
        fields.forEach(field => {
            if (field.type === 'date' && defaultValues[field.name]) {
                const parsedDate = parseISO(defaultValues[field.name]);
                if (isValid(parsedDate)) {
                    setSelectedDate(parsedDate);
                }
            }
        });
    }, [defaultValues, fields]);

    return (
        <>
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
                                <OverlayTrigger
                                    placement="auto"
                                    overlay={
                                        <Tooltip style={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                                            {field.tooltip}
                                        </Tooltip>
                                    }
                                    popperConfig={{
                                        modifiers: [
                                            { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'left', 'right'] } }
                                        ]
                                    }}
                                >
                                    <Form.Label><strong>{field.label}</strong></Form.Label>
                                </OverlayTrigger>
                                {(() => {
                                    if (field.type === 'select') {
                                        return (
                                            <Form.Control as="select" {...register(field.name, field.validation)}>
                                                {field.options.map((option, idx) => (
                                                    <option key={idx} value={option.value}>{option.label}</option>
                                                ))}
                                            </Form.Control>
                                        );
                                    } else if (field.type === 'date') {
                                        return (
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control"
                                                placeholderText="Selecciona la fecha"
                                            />
                                        );
                                    } else {
                                        return (
                                            <Form.Control
                                                type={field.type || 'text'}
                                                placeholder={field.placeholder}
                                                {...register(field.name, field.validation)}
                                            />
                                        );
                                    }
                                })()}
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

            {/* Modal de Confirmación */}
            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Guardado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas guardar los cambios?</p>
                </Modal.Body>
                <Modal.Footer className="button-container">
                    <button type="button" className="button-previous" onClick={() => setShowConfirmation(false)}>
                        CANCELAR
                    </button>
                    <button type="button" className="button-submit" onClick={() => handleSubmit(confirmSubmit)()}>
                        CONFIRMAR <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </Modal.Footer>
            </Modal>
        </>
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
        tooltip: PropTypes.string,
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
