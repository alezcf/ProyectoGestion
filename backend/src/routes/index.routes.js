"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import proveedorRoutes from "./proveedor.routes.js";
import vendedorRoutes from "./vendedor.routes.js";
import productoRoutes from "./producto.routes.js";
import inventarioRoutes from "./inventario.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/proveedor", proveedorRoutes)
    .use("/vendedor", vendedorRoutes)
    .use("/producto", productoRoutes)
    .use("/inventario", inventarioRoutes);
    
export default router;