"use strict";
import Joi from "joi";

export const proveedorQueryValidation = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
        "any.required": "El id es obligatorio.",
    }),
    email: Joi.string()
        .email()
        .optional()
        .messages({
        "string.empty": "El correo electrónico no puede estar vacío.",
        "any.required": "El correo electrónico es obligatorio.",
        "string.base": "El correo electrónico debe ser de tipo string.",
        "string.email": "El correo electrónico debe tener un formato válido.",
        }),
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/)
        .optional()
        .messages({
        "string.empty": "El RUT no puede estar vacío.",
        "any.required": "El RUT es obligatorio.",
        "string.base": "El RUT debe ser de tipo string.",
        "string.min": "El RUT debe tener como mínimo 9 caracteres.",
        "string.max": "El RUT debe tener como máximo 12 caracteres.",
        "string.pattern.base": "El RUT no tiene un formato válido.",
        }),
    })
    .or("id", "email", "rut")
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing":
        "Debes proporcionar al menos un parámetro: id, email o rut.",
    });

export const proveedorBodyValidation = Joi.object({
    nombre: Joi.string().min(3).max(255).required().messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
        "string.min": "El nombre debe tener como mínimo 3 caracteres.",
        "string.max": "El nombre debe tener como máximo 255 caracteres.",
    }),
    email: Joi.string()
        .email()
        .required()
        .messages({
        "string.empty": "El correo electrónico no puede estar vacío.",
        "any.required": "El correo electrónico es obligatorio.",
        "string.base": "El correo electrónico debe ser de tipo string.",
        "string.email": "El correo electrónico debe tener un formato válido.",
        }),
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/)
        .required()
        .messages({
        "string.empty": "El RUT no puede estar vacío.",
        "any.required": "El RUT es obligatorio.",
        "string.base": "El RUT debe ser de tipo string.",
        "string.min": "El RUT debe tener como mínimo 9 caracteres.",
        "string.max": "El RUT debe tener como máximo 12 caracteres.",
        "string.pattern.base": "El RUT no tiene un formato válido.",
        }),
    direccion: Joi.string().max(255).optional().messages({
        "string.empty": "La dirección no puede estar vacía.",
        "string.base": "La dirección debe ser de tipo string.",
        "string.max": "La dirección debe tener como máximo 255 caracteres.",
    }),
    telefono: Joi.string().min(8).max(20).optional().messages({
        "string.empty": "El teléfono no puede estar vacío.",
        "string.base": "El teléfono debe ser de tipo string.",
        "string.min": "El teléfono debe tener como mínimo 8 caracteres.",
        "string.max": "El teléfono debe tener como máximo 20 caracteres.",
    }),
})
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });
