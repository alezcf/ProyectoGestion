"use strict";
import Joi from "joi";

export const userQueryValidation = Joi.object({
  id: Joi.number().integer().positive().optional().messages({
    "number.base": "El id debe ser un número.",
    "number.integer": "El id debe ser un número entero.",
    "number.positive": "El id debe ser un número positivo.",
    "any.required": "El id es obligatorio.",
  }),
  email: Joi.string()
    .min(20)
    .max(50)
    .email()
    .optional()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.min":
        "El correo electrónico debe tener como mínimo 20 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 50 caracteres.",
    }),
  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/)
    .optional()
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "any.required": "El rut es obligatorio.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "El rut no tiene un formato válido.",
    }),
})
  .xor("id", "rut") // Exige que solo uno de estos dos esté presente (id o rut, pero no ambos)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parametro: id, email o rut.",
    "object.xor": "Debes proporcionar solo uno entre id o rut, no ambos.",
  });


  export const userBodyValidation = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
      "any.required": "El id es obligatorio.",
    }),
    nombreCompleto: Joi.string().min(3).max(50).required().messages({
      "string.empty": "El nombre completo no puede estar vacío.",
      "any.required": "El nombre completo es obligatorio.",
      "string.base": "El nombre completo debe ser de tipo string.",
      "string.min": "El nombre completo debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
    }),
    email: Joi.string()
      .min(10)
      .max(50)
      .email()
      .required()
      .messages({
        "string.empty": "El correo electrónico no puede estar vacío.",
        "any.required": "El correo electrónico es obligatorio.",
        "string.base": "El correo electrónico debe ser de tipo string.",
        "string.email": "El correo electrónico debe tener un formato válido.",
        "string.min":
          "El correo electrónico debe tener como mínimo 10 caracteres.",
        "string.max":
          "El correo electrónico debe tener como máximo 50 caracteres.",
      }),
    password: Joi.string()
      .min(3)
      .max(30)
      .pattern(new RegExp("^[a-zA-Z0-9]+$"))
      .optional()
      .messages({
        "string.empty": "La contraseña no puede estar vacía.",
        "any.required": "La contraseña es obligatoria.",
        "string.base": "La contraseña debe ser de tipo string.",
        "string.min": "La contraseña debe tener como mínimo 3 caracteres.",
        "string.max": "La contraseña debe tener como máximo 30 caracteres.",
        "string.pattern.base":
          "La contraseña solo puede contener letras y números.",
      }),
    newPassword: Joi.string()
      .min(3)
      .max(30)
      .pattern(new RegExp("^[a-zA-Z0-9]+$"))
      .optional()
      .messages({
        "string.empty": "La nueva contraseña no puede estar vacía.",
        "any.required": "La nueva contraseña es obligatoria.",
        "string.base": "La nueva contraseña debe ser de tipo string.",
        "string.min": "La nueva contraseña debe tener como mínimo 3 caracteres.",
        "string.max": "La nueva contraseña debe tener como máximo 30 caracteres.",
        "string.pattern.base":
          "La nueva contraseña solo puede contener letras y números.",
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
    rol: Joi.string().min(4).max(15).optional().messages({
      "string.base": "El rol debe ser de tipo string.",
      "string.min": "El rol debe tener como mínimo 4 caracteres.",
      "string.max": "El rol debe tener como máximo 15 caracteres.",
    }),
    isActive: Joi.boolean().optional().messages({
      "boolean.base": "El campo isActive debe ser un valor booleano.",
    }),
    createdAt: Joi.date().iso().optional().messages({
      "date.base": "El campo createdAt debe ser una fecha válida.",
      "date.format": "El campo createdAt debe estar en formato ISO 8601.",
    }),
    updatedAt: Joi.date().iso().optional().messages({
      "date.base": "El campo updatedAt debe ser una fecha válida.",
      "date.format": "El campo updatedAt debe estar en formato ISO 8601.",
    }),
  })
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
    });