import { EntitySchema } from "typeorm";

const ReporteSchema = new EntitySchema({
    name: "Reporte",
    tableName: "reporte",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        titulo: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: true,
        },
        fecha_creacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        tipo: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 50,
            nullable: false,
            default: "Pendiente",
        },
        datos: {
            type: "json",
            nullable: true,
        },
    },
    relations: {
        inventario: {
            target: "Inventario",
            type: "many-to-one",
            joinColumn: { name: "inventario_id" },
            nullable: true,
            eager: true,
            onDelete: "CASCADE",
        },
        producto: {
            target: "Producto",
            type: "many-to-one",
            joinColumn: { name: "producto_id" },
            nullable: true,
            eager: true,
            onDelete: "CASCADE",
        },
    },
});

export default ReporteSchema;
