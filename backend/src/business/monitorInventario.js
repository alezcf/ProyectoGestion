"use strict";
import ReporteService from "../services/reporte.service.js";
import InventarioService from "../services/inventario.service.js";
import ProductoInventario from "../services/productoInventario.service.js";

// Umbrales para la generación automática de reportes
const INVENTARIO_UMBRAL = 0.2; // 20% de capacidad
const PRODUCTO_UMBRAL = 10; // Stock bajo global, por ejemplo 10 unidades

// Función para eliminar todos los reportes pendientes
async function eliminarReportesPendientes() {
    try {
        await ReporteService.deleteAllPendingReportes();
        console.log("Todos los reportes pendientes han sido eliminados.");
    } catch (error) {
        console.error("Error al eliminar reportes pendientes:", error);
    }
}

// Función para crear o actualizar un reporte
async function generarOActualizarReporte(titulo, descripcion, tipo, datos) {
    try {
        const reporteExistente = await ReporteService.createOrUpdateReporte({
            titulo,
            descripcion,
            tipo,
            datos
        });

        if (reporteExistente) {
            console.log("Reporte generado o actualizado exitosamente:", titulo);
        }
    } catch (error) {
        console.error("Error al generar o actualizar el reporte:", error);
    }
}

// Función principal para monitorear inventarios y productos
async function monitorInventariosYProductos() {
    try {
        // Eliminar todos los reportes pendientes antes de generar nuevos
        await eliminarReportesPendientes();

        // Obtener todos los inventarios
        const [inventarios] = await InventarioService.getInventarios();
        for (const inventario of inventarios) {
            const stockActual = (inventario.productoInventarios || []).reduce((total, p) => total + p.cantidad, 0);

            if (stockActual < inventario.maximo_stock * INVENTARIO_UMBRAL) {
                await generarOActualizarReporte(
                    `Inventario bajo en ${inventario.nombre}`,
                    `El inventario ${inventario.nombre} está bajo (actual: ${stockActual} de ${inventario.maximo_stock})`,
                    "inventario",
                    { inventarioId: inventario.id, stockActual, maximoStock: inventario.maximo_stock }
                );
            }

            for (const productoInventario of inventario.productoInventarios || []) {
                if (productoInventario.cantidad < PRODUCTO_UMBRAL) {
                    await generarOActualizarReporte(
                        `Producto bajo en inventario ${inventario.nombre}`,
                        `El producto ${productoInventario.producto.nombre} está bajo en el inventario ${inventario.nombre} (actual: ${productoInventario.cantidad})`,
                        "producto",
                        { productoId: productoInventario.producto.id, inventarioId: inventario.id, cantidad: productoInventario.cantidad }
                    );
                }
            }
        }

        const stockGlobalProductos = await ProductoInventario.getStockGlobalProductos();

        // Verificar que cada producto no sea nulo antes de intentar desestructurarlo
        for (const producto of stockGlobalProductos) {
            if (producto) {
                const { productoId, stockGlobal } = producto;
                if (stockGlobal < PRODUCTO_UMBRAL) {
                    await generarOActualizarReporte(
                        `Stock bajo global para producto ID ${productoId}`,
                        `El stock total del producto con ID ${productoId} está bajo en todos los inventarios combinados (actual: ${stockGlobal})`,
                        "producto",
                        { productoId, stockGlobal }
                    );
                }
            } else {
                console.log("Producto nulo encontrado en stockGlobalProductos");
            }
        }

        console.log("Monitoreo de inventarios y productos finalizado.");
    } catch (error) {
        console.error("Error al monitorear inventarios y productos:", error);
    }
}

export default monitorInventariosYProductos;
