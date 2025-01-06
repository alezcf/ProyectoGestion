import React from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ConfirmDeleteModal = ({ show, onClose, onConfirm, title = "Confirmar Eliminación", message = "¿Estás seguro de que deseas realizar esta acción? Esta acción no se puede deshacer." }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <center><Modal.Title>{title}</Modal.Title></center>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer className="button-container">
                <button type="button" className="button-previous" onClick={onClose}>
                    CANCELAR
                </button>
                <button type="button" className="button-submit" onClick={onConfirm}>
                    CONFIRMAR <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeleteModal;
