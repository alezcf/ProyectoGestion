"use strict";
import Joi from "joi";

// Validación para actualizar relaciones entre productos y proveedores
export const productoProveedoresValidation = Joi.object({
    productoId: Joi.number().integer().positive().required().messages({
        "number.base": "El ID del producto debe ser un número.",
        "number.integer": "El ID del producto debe ser un número entero.",
        "number.positive": "El ID del producto debe ser un número positivo.",
        "any.required": "El ID del producto es obligatorio.",
    }),
    proveedoresIds: Joi.array()
        .items(
            Joi.number().integer().positive().messages({
                "number.base": "Cada ID de proveedor debe ser un número.",
                "number.integer": "Cada ID de proveedor debe ser un número entero.",
                "number.positive": "Cada ID de proveedor debe ser un número positivo."
            })
        )
        .min(0) // Permite que el array esté vacío
        .required()
        .messages({
            "array.base": "El campo proveedoresIds debe ser un arreglo.",
            "any.required": "El campo proveedoresIds es obligatorio."
        }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});
