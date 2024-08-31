"use strict";
import Joi from "joi";

export const pedidoQueryValidation = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
        "any.required": "El id es obligatorio.",
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

export const pedidoBodyValidation = Joi.object({
    proveedor_id: Joi.number().integer().positive().required().messages({
        "number.base": "El ID del proveedor debe ser un número.",
        "number.integer": "El ID del proveedor debe ser un número entero.",
        "number.positive": "El ID del proveedor debe ser un número positivo.",
        "any.required": "El ID del proveedor es obligatorio.",
    }),
    inventario_asignado_id: Joi.number().integer().positive().required().messages({
        "number.base": "El ID del inventario asignado debe ser un número.",
        "number.integer": "El ID del inventario asignado debe ser un número entero.",
        "number.positive": "El ID del inventario asignado debe ser un número positivo.",
        "any.required": "El ID del inventario asignado es obligatorio.",
    }),
    fecha_pedido: Joi.date().iso().required().messages({
        "date.base": "La fecha del pedido debe ser una fecha válida.",
        "date.format": "La fecha del pedido debe estar en formato ISO.",
        "any.required": "La fecha del pedido es obligatoria.",
    }),
    estado: Joi.string().valid("pendiente", "completado", "cancelado").required().messages({
        "string.empty": "El estado no puede estar vacío.",
        "any.required": "El estado es obligatorio.",
        "string.base": "El estado debe ser de tipo string.",
        "any.only": "El estado debe ser uno de los siguientes: " +
            "'pendiente', 'completado', 'cancelado'.",
    }),
    productos: Joi.array().items(
        Joi.object({
            productoId: Joi.number().integer().positive().required().messages({
                "number.base": "El ID del producto debe ser un número.",
                "number.integer": "El ID del producto debe ser un número entero.",
                "number.positive": "El ID del producto debe ser un número positivo.",
                "any.required": "El ID del producto es obligatorio.",
            }),
            cantidad: Joi.number().positive().required().messages({
                "number.base": "La cantidad debe ser un número.",
                "number.positive": "La cantidad debe ser un número positivo.",
                "any.required": "La cantidad es obligatoria.",
            }),
        })
    ).min(1).required().messages({
        "array.base": "Productos debe ser un arreglo de objetos.",
        "array.min": "Debe haber al menos un producto en el pedido.",
        "any.required": "El campo productos es obligatorio.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});
