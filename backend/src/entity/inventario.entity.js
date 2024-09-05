import { EntitySchema } from "typeorm";
import ProductoInventario from "./producto_inventario.entity.js";

const InventarioSchema = new EntitySchema({
    name: "Inventario",
    tableName: "inventario",
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
        maximo_stock: {
            type: "int",
            nullable: true,
        },
        ultima_actualizacion: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    relations: {
        productoInventarios: {
            target: ProductoInventario,
            type: "one-to-many",
            inverseSide: "inventario",
        }
    }
});

export default InventarioSchema;
