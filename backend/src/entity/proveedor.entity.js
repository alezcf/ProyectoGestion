import { EntitySchema } from "typeorm";

const ProveedorSchema = new EntitySchema({
    name: "Proveedor",
    tableName: "proveedores",
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
        nullable: false,
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
        nullable: false,
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
});

export default ProveedorSchema;
