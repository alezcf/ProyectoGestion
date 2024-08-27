"use strict";
import { EntitySchema } from "typeorm";
import Proveedor from "./proveedor.entity.js";

const VendedorSchema = new EntitySchema({
    name: "Vendedor",
    tableName: "vendedores",
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
        telefono: {
        type: "varchar",
        length: 20,
        nullable: false,
        },
        email: {
        type: "varchar",
        length: 255,
        nullable: false,
        unique: true,
        },
    },
    relations: {
        proveedor: {
        target: Proveedor,
        type: "many-to-one",
        joinColumn: {
            name: "proveedor_id",
        },
        eager: true,
        },
    },
});

export default VendedorSchema;
