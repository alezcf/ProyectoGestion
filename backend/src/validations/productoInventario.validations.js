"use strict";
import Joi from "joi";

// Validaciones para las relaciones entre un producto y varios inventarios
export const productoInventarioValidation = Joi.object({
    productoId: Joi.number().integer().positive().required().messages({
        "number.base": "El ID del producto debe ser un número.",
        "number.integer": "El ID del producto debe ser un número entero.",
        "number.positive": "El ID del producto debe ser un número positivo.",
        "any.required": "El ID del producto es obligatorio.",
    }),
    inventariosIds: Joi.array()
        .items(
            Joi.number().integer().positive().required().messages({
                "number.base": "Cada ID de inventario debe ser un número.",
                "number.integer": "Cada ID de inventario debe ser un número entero.",
                "number.positive": "Cada ID de inventario debe ser un número positivo.",
                "any.required": "El ID del inventario es obligatorio."
            })
        )
        .min(1) // Al menos un inventario debe estar presente
        .required()
        .messages({
            "array.base": "El campo inventariosIds debe ser un arreglo.",
            "array.min": "Debe haber al menos un ID de inventario.",
            "any.required": "El campo inventariosIds es obligatorio."
        }),
    cantidades: Joi.array()
        .items(
            Joi.number().positive().required().messages({
                "number.base": "Cada cantidad debe ser un número.",
                "number.positive": "Cada cantidad debe ser un número positivo.",
                "any.required": "La cantidad es obligatoria."
            })
        )
        .length(Joi.ref("inventariosIds.length"))
        .required()
        .messages({
            "array.base": "El campo cantidades debe ser un arreglo.",
            "array.length": "El número de cantidades debe coincidir con el número de IDs de inventario.",
            "any.required": "El campo cantidades es obligatorio."
        }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});
