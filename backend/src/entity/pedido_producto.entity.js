import { EntitySchema } from "typeorm";
import Pedido from "./pedido.entity.js";
import Producto from "./producto.entity.js";

const PedidoProductoSchema = new EntitySchema({
    name: "PedidoProducto",
    tableName: "pedido_producto",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        cantidad: {
            type: "numeric",
            nullable: false,
        },
    },
    relations: {
        pedido: {
            target: Pedido,
            type: "many-to-one",
            joinColumn: { name: "pedido_id" },
            nullable: false,
            eager: true,
        },
        producto: {
            target: Producto,
            type: "many-to-one",
            joinColumn: { name: "producto_id" },
            nullable: false,
            eager: true,
        },
    },
});

export default PedidoProductoSchema;
