import { EntitySchema } from "typeorm";
import Inventario from "./inventario.entity.js";
import Producto from "./producto.entity.js";

const ProductoInventarioSchema = new EntitySchema({
    name: "ProductoInventario",
    tableName: "producto_inventario",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad: {
            type: "int",
            nullable: false,
        }
    },
    relations: {
        inventario: {
            target: Inventario,
            type: "many-to-one",
            joinColumn: { name: "inventario_id" },
            inverseSide: "productoInventarios"
        },
        producto: {
            target: Producto,
            type: "many-to-one",
            joinColumn: { name: "producto_id" },
            inverseSide: "productoInventarios"
        }
    }
});

export default ProductoInventarioSchema;
