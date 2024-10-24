import exceljs from "exceljs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Estas dos líneas reemplazan el uso de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Exporta un array de objetos a un archivo Excel
 * @param {Array} arrayData - Array de objetos a exportar
 * @returns {Promise} Promesa que resuelve con la ruta del archivo Excel o un error
 */
export async function exportArrayToExcel(arrayData) {
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Datos Exportados");

        // Agregar encabezados de la tabla (basados en las keys del primer objeto del array)
        const headers = Object.keys(arrayData[0]);
        worksheet.columns = headers.map(header => ({
            header,
            key: header,
            width: Math.max(
                ...arrayData.map(data => data[header]?.toString().length || 10),
                header.length
            ) + 5
        }));

        // Estilos para el encabezado
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF4CAF50" }, // Color de fondo (verde oscuro)
                bgColor: { argb: "FF000000" }  // Color de fondo alternativo
            };
            cell.font = {
                bold: true,
                color: { argb: "FFFFFFFF" } // Color de fuente (blanco)
            };
            cell.alignment = { vertical: "middle", horizontal: "center" }; // Alineación
        });

        // Agregar filas y aplicar estilos alternos
        arrayData.forEach((data, index) => {
            const rowData = {};
            for (const key in data) {
                // Verificar que todos los campos estén llenos, si no, asignar "No registrado"
                rowData[key] = data[key] === null || data[key] === ""
                    ? "No registrado"
                    : data[key];
            }
            const row = worksheet.addRow(rowData);

            // Estilo de fondo para filas alternas
            const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFEEEEEE"; // Blanco y gris claro

            row.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: fillColor },
                };
                cell.alignment = { vertical: "middle", horizontal: "center" }; // Alineación
            });
        });

        // Asegurarse de que el directorio tmp exista
        const tmpDir = path.join(__dirname, "../tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Guardar el archivo
        const filePath = path.join(tmpDir, "exported_data.xlsx");
        await workbook.xlsx.writeFile(filePath);

        return [filePath, null];
    } catch (error) {
        console.error("Error al exportar a Excel:", error);
        return [null, "Error interno al exportar a Excel"];
    }
}

/**
 * Exporta un objeto y varios arrays a un archivo Excel.
 * @param {Object} dataObject - Objeto de datos para exportar.
 * @param {Array} [arrayData=[]] - Arrays de datos a exportar (opcional).
 * @param {Object} [sheetNames={}] - Nombres de las hojas para el Excel. Puede incluir 'mainSheet', 'arraySheet1', y 'arraySheet2'.
 * @returns {Promise} Promesa que resuelve con la ruta del archivo Excel o un error.
 */
export async function exportObjectAndArraysToExcel(dataObject, arrayData = [], sheetNames = {}) {
    try {
        const workbook = new exceljs.Workbook();
        console.log(sheetNames);
        const mainSheetName = sheetNames.mainSheet || "Datos Principales";
        const arraySheet1Name = sheetNames.arraySheet1 || "Array 1";
        const arraySheet2Name = sheetNames.arraySheet2 || "Array 2";


        // Crear la hoja principal para los datos del objeto
        const mainSheet = workbook.addWorksheet(mainSheetName);
        mainSheet.columns = [
            { header: "Propiedad", key: "propiedad", width: 30 },
            { header: "Valor", key: "valor", width: 50 }
        ];

        // Rellenar la hoja con los datos del objeto
        Object.keys(dataObject).forEach((key) => {
            mainSheet.addRow({ propiedad: key, valor: dataObject[key] });
        });

        // Crear una hoja para los datos del primer array si existen
        if (arrayData[0] && arrayData[0].length > 0) {
            const arraySheet1 = workbook.addWorksheet(arraySheet1Name);
            const array1Columns = Object.keys(arrayData[0][0]).map(key => ({
                header: key.toUpperCase(),
                key: key,
                width: 30
            }));
            arraySheet1.columns = array1Columns;

            // Rellenar la hoja con los datos del array
            arrayData[0].forEach((item) => {
                arraySheet1.addRow(item);
            });
        }

        // Crear una hoja para los datos del segundo array si existen
        if (arrayData[1] && arrayData[1].length > 0) {
            const arraySheet2 = workbook.addWorksheet(arraySheet2Name);
            const array2Columns = Object.keys(arrayData[1][0]).map(key => ({
                header: key.toUpperCase(),
                key: key,
                width: 30
            }));
            arraySheet2.columns = array2Columns;

            // Rellenar la hoja con los datos del array
            arrayData[1].forEach((item) => {
                arraySheet2.addRow(item);
            });
        }

        // Asegurarse de que el directorio tmp exista
        const tmpDir = path.join(__dirname, "../tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Guardar el archivo
        const filePath = path.join(tmpDir, "exported_data.xlsx");
        await workbook.xlsx.writeFile(filePath);

        return [filePath, null];
    } catch (error) {
        console.error("Error al exportar a Excel:", error);
        return [null, "Error interno al exportar a Excel"];
    }
}

export default {
    exportArrayToExcel,
    exportObjectAndArraysToExcel,
};
