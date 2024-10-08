"use strict";
import CATEGORIAS from "../constants/categorias.constants.js";
import MEDIDAS from "../constants/medidas.constants.js";
import TIPOS from "../constants/tipos.constants.js";
import {
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * Obtiene todas las constantes
 * @param {Object} res - Objeto de respuesta
 */
export async function getConstantsProducto(req, res) {
    try {
        const constants = {
            categorias: CATEGORIAS,
            medidas: MEDIDAS,
            tipos: TIPOS,
        };
        handleSuccess(res, 200, "Constantes encontradas", constants);
    } catch (error) {
        handleErrorServer(res, 500, "Error obteniendo las constantes", error.message);
    }
}

export default {
  getConstantsProducto,
};