"use strict";
import Joi from "joi";

export const productoQueryValidation = Joi.object({
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

export const productoBodyValidation = Joi.object({
    nombre: Joi.string().min(3).max(255).required().messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
        "string.min": "El nombre debe tener como mínimo 3 caracteres.",
        "string.max": "El nombre debe tener como máximo 255 caracteres.",
    }),
    descripcion: Joi.string().max(1000).required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
        "string.max": "La descripción debe tener como máximo 1000 caracteres.",
    }),
    categoria: Joi.string().max(50).required().messages({
        "string.empty": "La categoría no puede estar vacía.",
        "any.required": "La categoría es obligatoria.",
        "string.base": "La categoría debe ser de tipo string.",
        "string.max": "La categoría debe tener como máximo 50 caracteres.",
    }),
    marca: Joi.string().max(255).optional().messages({
        "string.empty": "La marca no puede estar vacía.",
        "string.base": "La marca debe ser de tipo string.",
        "string.max": "La marca debe tener como máximo 255 caracteres.",
    }),
    cantidad: Joi.number().positive().optional().messages({
        "number.base": "La cantidad debe ser un número.",
        "number.positive": "La cantidad debe ser un número positivo.",
    }),
    unidad_medida: Joi.string().max(10).optional().messages({
        "string.empty": "La unidad de medida no puede estar vacía.",
        "string.base": "La unidad de medida debe ser de tipo string.",
        "string.max": "La unidad de medida debe tener como máximo 10 caracteres.",
    }),
    precio: Joi.number().positive().optional().messages({
        "number.base": "El precio debe ser un número.",
        "number.positive": "El precio debe ser un número positivo.",
    }),
    tipo: Joi.string().max(50).optional().messages({
        "string.empty": "El tipo no puede estar vacío.",
        "string.base": "El tipo debe ser de tipo string.",
        "string.max": "El tipo debe tener como máximo 50 caracteres.",
    }),
    imagen_ruta: Joi.string().max(255).optional().messages({
        "string.base": "La ruta de imagen debe ser de tipo string.",
        "string.max": "La ruta de imagen debe tener como máximo 255 caracteres.",
    }),
    proveedores: Joi.array()
    .items(Joi.number().integer().positive().messages({
        "number.base": "El ID del proveedor debe ser un número.",
        "number.integer": "El ID del proveedor debe ser un número entero.",
        "number.positive": "El ID del proveedor debe ser un número positivo.",
    }))
    .optional()
    .allow(null)
    .messages({
        "array.base": "Proveedores debe ser un arreglo de IDs.",
        "array.includes": "Proveedores debe contener solo IDs válidos.",
    }),

})
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });
