import { EntitySchema } from "typeorm";

const ProductoProveedorSchema = new EntitySchema({
    name: "ProductoProveedor",
    tableName: "producto_proveedor",  // Nombre de la tabla intermedia
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
    },
    relations: {
        producto: {
            target: "Producto",
            type: "many-to-one",
            joinColumn: { name: "producto_id", referencedColumnName: "id" },
        },
        proveedor: {
            target: "Proveedor",
            type: "many-to-one",
            joinColumn: { name: "proveedor_id", referencedColumnName: "id" },
            inverseSide: "productoProveedores",
        }
    },

});

export default ProductoProveedorSchema;
