"use strict";
import Joi from "joi";

export const inventarioQueryValidation = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
        "any.required": "El id es obligatorio.",
    })
})
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });

// Validación para el cuerpo de las solicitudes POST y PUT
export const inventarioBodyValidation = Joi.object({
    nombre: Joi.string().min(3).max(255).required().messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
        "string.min": "El nombre debe tener como mínimo 3 caracteres.",
        "string.max": "El nombre debe tener como máximo 255 caracteres.",
    }),
    stock_actual: Joi.number().integer().min(0).optional().messages({
        "number.base": "El stock actual debe ser un número.",
        "number.integer": "El stock actual debe ser un número entero.",
        "number.min": "El stock actual no puede ser negativo.",
    }),
    maximo_stock: Joi.number().integer().min(0).optional().messages({
        "number.base": "El máximo stock debe ser un número.",
        "number.integer": "El máximo stock debe ser un número entero.",
        "number.min": "El máximo stock no puede ser negativo.",
    }),
    fecha_ingreso: Joi.date().optional().messages({
        "date.base": "La fecha de ingreso debe ser una fecha válida.",
    }),
    fecha_actualizacion: Joi.date().optional().messages({
        "date.base": "La fecha de actualización debe ser una fecha válida.",
    }),
    productos: Joi.array()
        .items(Joi.number().integer().positive().messages({
            "number.base": "El ID del producto debe ser un número.",
            "number.integer": "El ID del producto debe ser un número entero.",
            "number.positive": "El ID del producto debe ser un número positivo.",
        }))
        .optional()
        .allow(null)
        .messages({
            "array.base": "Productos debe ser un arreglo de IDs.",
            "array.includes": "Productos debe contener solo IDs válidos.",
        }),
})
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });
