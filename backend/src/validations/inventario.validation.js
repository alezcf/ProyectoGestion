"use strict";
import Joi from "joi";

export const inventarioQueryValidation = Joi.object({
    id: Joi.number().integer().positive().required().messages({
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
    nombre: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^(?!\d+$).*/, "no solo números") // Validación para evitar que sea solo números
    .required()
    .messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
        "string.min": "El nombre debe tener como mínimo 3 caracteres.",
        "string.max": "El nombre debe tener como máximo 50 caracteres.",
        "string.pattern.name": "El nombre no puede ser solo números.",
    }),
    maximo_stock: Joi.number().integer().min(2).max(1500).required().messages({
        "number.base": "El máximo stock debe ser un número.",
        "number.integer": "El máximo stock debe ser un número entero positivo.",
        "number.min": "El máximo stock no puede ser menor a 2.",
        "number.max": "El máximo stock no puede ser mayor a 1500.",
    }),
    fecha_ingreso: Joi.date().optional().messages({
        "date.base": "La fecha de ingreso debe ser una fecha válida.",
    }),
    fecha_actualizacion: Joi.date().optional().messages({
        "date.base": "La fecha de actualización debe ser una fecha válida.",
    }),
    productos: Joi.array()
    .items(
        Joi.object({
            id: Joi.number().integer().positive().required().messages({
                "number.base": "El ID del producto debe ser un número.",
                "number.integer": "El ID del producto debe ser un número entero.",
                "number.positive": "El ID del producto debe ser un número positivo.",
                "any.required": "El ID del producto es obligatorio.",
            }),
            cantidad: Joi.number().integer().positive().required().messages({
                "number.base": "La cantidad debe ser un número.",
                "number.integer": "La cantidad debe ser un número entero.",
                "number.positive": "La cantidad debe ser un número positivo.",
                "any.required": "La cantidad es obligatoria.",
            }),
        })
    )
    .optional()
    .allow(null)
    .messages({
        "array.base": "Productos debe ser un arreglo de objetos.",
        "array.includes": "Productos debe contener objetos válidos con ID y cantidad.",
    }),
})
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });
