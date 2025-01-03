"use strict";
import Joi from "joi";
import CATEGORIAS from "../constants/categorias.constants.js";
import MEDIDAS from "../constants/medidas.constants.js";
import TIPOS from "../constants/tipos.constants.js";

export const productoQueryValidation = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
        "any.required": "El id es obligatorio.",
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});

export const productoBodyValidation = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        "number.base": "El id debe ser un número.",
        "number.integer": "El id debe ser un número entero.",
        "number.positive": "El id debe ser un número positivo.",
        "any.required": "El id es obligatorio.",
    }),
    nombre: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^(?!\d+$).*/, "no solo números")
    .required()
    .messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
        "string.min": "El nombre debe tener como mínimo 3 caracteres.",
        "string.max": "El nombre debe tener como máximo 50 caracteres.",
        "string.pattern.name": "El nombre no puede ser solo números.",
    }),
    descripcion: Joi.string().min(5).max(1000).required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
        "string.min": "La descripción debe tener como minimo 5 caracteres.",
        "string.max": "La descripción debe tener como máximo 1000 caracteres."
    }),
    categoria: Joi.string().valid(...CATEGORIAS).required().messages({
        "string.empty": "La categoría no puede estar vacía.",
        "any.required": "La categoría es obligatoria.",
        "any.only": "La categoría debe ser una de las siguientes: {#valids}."
    }),
    marca: Joi.string()
    .max(255)
    .allow(null, "") // Permite valores `null` o cadena vacía
    .optional()
    .messages({
        "string.empty": "La marca no puede estar vacía.",
        "string.base": "La marca debe ser de tipo string.",
        "string.max": "La marca debe tener como máximo 255 caracteres.",
    }),
    contenido: Joi.number().positive().min(1).max(1000).required().messages({
        "number.base": "El contenido debe ser un número.",
        "number.positive": "El contenido debe ser un número positivo.",
        "number.min": "El contenido no puede ser menor a 1.",
        "number.max": "El contenido no puede ser mayor a 1000",
    }),
    unidad_medida: Joi.string().valid(...MEDIDAS).required().messages({
        "string.empty": "La unidad de medida no puede estar vacía.",
        "any.only": "La unidad de medida debe ser una de las siguientes: {#valids}."
    }),
    precio: Joi.number().positive().min(10).max(1000000).required().messages({
        "number.base": "El precio debe ser un número.",
        "any.required": "El precio es obligatorio.",
        "number.positive": "El precio debe ser un número positivo.",
        "number.min": "El precio no puede ser menor a 10.",
        "number.max": "El precio no puede ser mayor a 1.000.000",
    }),
    tipo: Joi.string().valid(...TIPOS).required().messages({
        "string.empty": "El tipo no puede estar vacío.",
        "any.only": "El tipo debe ser uno de los siguientes: {#valids}."
    }),
    imagen_ruta: Joi.string().max(255).allow(null).optional().messages({
        "string.base": "La ruta de imagen debe ser de tipo string.",
        "string.max": "La ruta de imagen debe tener como máximo 255 caracteres.",
        "any.only": "La ruta de imagen debe ser de tipo string o null."
    }),
    proveedores: Joi.array().items(Joi.number().integer().positive().messages({
        "number.base": "El ID del proveedor debe ser un número.",
        "number.integer": "El ID del proveedor debe ser un número entero.",
        "number.positive": "El ID del proveedor debe ser un número positivo."
    })).unique().optional().allow(null).messages({
        "array.base": "Proveedores debe ser un arreglo de IDs.",
        "array.includes": "Proveedores debe contener solo IDs válidos.",
        "array.unique": "Cada ID de proveedor debe ser único."
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});