import { Router } from "express";
import productsRouter from "@modules/products/routes/products.routes";
import usersRouter from "@modules/users/routes/users.routes";
import sessionRouter from "@modules/users/routes/sessions.routes";

const router = Router()

router.use("/products", productsRouter)
router.use("/users", usersRouter)
router.use("/sessions", sessionRouter)

export default router