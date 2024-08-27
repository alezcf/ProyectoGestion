"use strict";
import Joi from "joi";

export const vendedorQueryValidation = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
    }),
    email: Joi.string()
        .email()
        .optional()
        .messages({
        "string.empty": "El correo electrónico no puede estar vacío.",
        "string.base": "El correo electrónico debe ser de tipo string.",
        "string.email": "El correo electrónico debe tener un formato válido.",
        }),
    })
    .or("id", "email")
    .messages({
        "object.missing": "Debes proporcionar al menos un parámetro: id o email.",
    });

export const vendedorBodyValidation = Joi.object({
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
    telefono: Joi.string().min(8).max(20).optional().messages({
        "string.empty": "El teléfono no puede estar vacío.",
        "string.base": "El teléfono debe ser de tipo string.",
        "string.min": "El teléfono debe tener como mínimo 8 caracteres.",
        "string.max": "El teléfono debe tener como máximo 20 caracteres.",
    }),
    proveedor_id: Joi.number().integer().positive().required().messages({
        "number.base": "El ID del proveedor debe ser un número.",
        "number.integer": "El ID del proveedor debe ser un número entero.",
        "number.positive": "El ID del proveedor debe ser un número positivo.",
        "any.required": "El ID del proveedor es obligatorio.",
    }),
});
