import { EntitySchema } from "typeorm";
import Producto from "./producto.entity.js";

const InventarioSchema = new EntitySchema({
    name: "Inventario",
    tableName: "inventarios",
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
        stock_actual: {
            type: "int",
            nullable: true,
        },
        maximo_stock: {
            type: "int",
            nullable: true,
        },
        fecha_ingreso: {
            type: "timestamp",
            nullable: true,
        },
        fecha_actualizacion: {
            type: "timestamp",
            nullable: true,
        },
    },
    relations: {
        productos: {
            target: Producto,
            type: "many-to-many",
            joinTable: {
                name: "inventario_productos",
                joinColumn: { name: "inventario_id", referencedColumnName: "id" },
                inverseJoinColumn: { name: "producto_id", referencedColumnName: "id" },
            },
        },
    },
});

export default InventarioSchema;
