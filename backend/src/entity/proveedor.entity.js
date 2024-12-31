import { EntitySchema } from "typeorm";
import ProductoProveedor from "./producto_proveedor.entity.js";
const ProveedorSchema = new EntitySchema({
    name: "Proveedor",
    tableName: "proveedor",
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
        rut: {
        type: "varchar",
        length: 12,
        nullable: true,
        unique: true,
        },
        direccion: {
        type: "varchar",
        length: 255,
        nullable: true,
        },
        telefono: {
        type: "varchar",
        length: 20,
        nullable: true,
        },
        email: {
        type: "varchar",
        length: 255,
        nullable: true,
        unique: true,
        },
    },
    indices: [
        {
        name: "IDX_PROVEEDOR_RUT",
        columns: ["rut"],
        unique: true,
        },
        {
        name: "IDX_PROVEEDOR_EMAIL",
        columns: ["email"],
        unique: true,
        },
    ],
    relations: {
        productoProveedores: {
            target: ProductoProveedor,
            type: "one-to-many",
            inverseSide: "proveedor",
        },
    }
});

export default ProveedorSchema;
