import { EntitySchema } from "typeorm";
import ProductoProveedor from "./producto_proveedor.entity.js";
import ProductoInventario from "./producto_inventario.entity.js";

const ProductoSchema = new EntitySchema({
    name: "Producto",
    tableName: "producto",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: true,
        },
        marca: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        contenido: { // Corrección de cantidad a contenido.
            type: "numeric",
            nullable: true,
        },
        unidad_medida: {
            type: "varchar",
            length: 10,
            nullable: true,
        },
        precio: {
            type: "numeric",
            nullable: true,
        },
        categoria: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        tipo: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        imagen_ruta: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
    },
    relations: {
        productoProveedores: {
            target: ProductoProveedor,
            type: "one-to-many",
            inverseSide: "producto",
        },
        productoInventarios: {
            target: ProductoInventario,
            type: "one-to-many",
            inverseSide: "producto",
        },
    },
});

export default ProductoSchema;
