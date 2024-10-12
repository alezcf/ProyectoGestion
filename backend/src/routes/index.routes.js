"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import proveedorRoutes from "./proveedor.routes.js";
import vendedorRoutes from "./vendedor.routes.js";
import productoRoutes from "./producto.routes.js";
import inventarioRoutes from "./inventario.routes.js";
import pedidoRoutes from "./pedido.routes.js";
import emailRoutes from "./email.routes.js";
import constantsRoutes from "./constants.routes.js";
import productoProveedorRoutes from "./productoProveedor.routes.js";
const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/proveedor", proveedorRoutes)
    .use("/vendedor", vendedorRoutes)
    .use("/producto", productoRoutes)
    .use("/inventario", inventarioRoutes)
    .use("/pedido", pedidoRoutes)
    .use("/email", emailRoutes)
    .use("/constants", constantsRoutes)
    .use("/producto-proveedores", productoProveedorRoutes);

export default router;