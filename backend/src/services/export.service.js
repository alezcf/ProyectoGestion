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
        const mainSheetName = sheetNames.mainSheet || "Datos Principales";
        const arraySheet1Name = sheetNames.arraySheet1 || "Array 1";
        const arraySheet2Name = sheetNames.arraySheet2 || "Array 2";

        // Crear la hoja principal para los datos del objeto con encabezado combinado
        const mainSheet = workbook.addWorksheet(mainSheetName);
        mainSheet.columns = [
            { header: "", key: "propiedad", width: 30 },
            { header: "", key: "valor", width: 50 }
        ];

        // Fusionar celdas para el encabezado combinado
        mainSheet.mergeCells("A1:B1");
        mainSheet.getCell("A1").value = "CARACTERISTICAS GENERALES";
        mainSheet.getCell("A1").fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4CAF50" },
            bgColor: { argb: "FF000000" }
        };
        mainSheet.getCell("A1").font = {
            bold: true,
            color: { argb: "FFFFFFFF" }
        };
        mainSheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };

        // Rellenar la hoja principal con "NO REGISTRADO" para campos no definidos
        Object.keys(dataObject).forEach((key, index) => {
            const rowData = {
                propiedad: key,
                valor: dataObject[key] != null ? dataObject[key] : "NO REGISTRADO"
            };
            const row = mainSheet.addRow(rowData);
            const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFEEEEEE";
            row.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: fillColor },
                };
                cell.alignment = { vertical: "middle", horizontal: "center" };
            });
        });

        // Configurar y rellenar la primera hoja de datos del array con "NO REGISTRADO" para campos no definidos
        if (arrayData[0] && arrayData[0].length > 0) {
            const arraySheet1 = workbook.addWorksheet(arraySheet1Name);
            arraySheet1.columns = Object.keys(arrayData[0][0]).map(key => ({
                header: key.toUpperCase(),
                key: key,
                width: 30
            }));

            arraySheet1.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF4CAF50" },
                    bgColor: { argb: "FF000000" }
                };
                cell.font = {
                    bold: true,
                    color: { argb: "FFFFFFFF" }
                };
                cell.alignment = { vertical: "middle", horizontal: "center" };
            });

            arrayData[0].forEach((item, index) => {
                const rowData = {};
                arraySheet1.columns.forEach(({ key }) => {
                    rowData[key] = item[key] != null ? item[key] : "NO REGISTRADO";
                });
                const row = arraySheet1.addRow(rowData);
                const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFEEEEEE";
                row.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: fillColor },
                    };
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                });
            });
        }

        // Configurar y rellenar la segunda hoja de datos del array con "NO REGISTRADO" para campos no definidos
        if (arrayData[1] && arrayData[1].length > 0) {
            const arraySheet2 = workbook.addWorksheet(arraySheet2Name);
            arraySheet2.columns = Object.keys(arrayData[1][0]).map(key => ({
                header: key.toUpperCase(),
                key: key,
                width: 30
            }));

            arraySheet2.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF4CAF50" },
                    bgColor: { argb: "FF000000" }
                };
                cell.font = {
                    bold: true,
                    color: { argb: "FFFFFFFF" }
                };
                cell.alignment = { vertical: "middle", horizontal: "center" };
            });

            arrayData[1].forEach((item, index) => {
                const rowData = {};
                arraySheet2.columns.forEach(({ key }) => {
                    rowData[key] = item[key] != null ? item[key] : "NO REGISTRADO";
                });
                const row = arraySheet2.addRow(rowData);
                const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFEEEEEE";
                row.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: fillColor },
                    };
                    cell.alignment = { vertical: "middle", horizontal: "center" };
                });
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
