"use strict";
import Joi from "joi";

// Validación del cuerpo de la solicitud para enviar correos
export const emailValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "El email debe ser válido.",
        "any.required": "El email es obligatorio.",
        "string.empty": "El email no puede estar vacío.",
    }),
    subject: Joi.string().min(3).max(255).required().messages({
        "string.min": "El asunto debe tener al menos 3 caracteres.",
        "string.max": "El asunto no puede exceder 255 caracteres.",
        "any.required": "El asunto es obligatorio.",
        "string.empty": "El asunto no puede estar vacío.",
    }),
    message: Joi.string().min(5).required().messages({
        "string.min": "El mensaje debe tener al menos 5 caracteres.",
        "any.required": "El mensaje es obligatorio.",
        "string.empty": "El mensaje no puede estar vacío.",
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});
