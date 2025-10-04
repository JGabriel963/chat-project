import { Router } from "express";
import { authRoutes } from "./auth";
import { messageRoutes } from "./messages";

const routes = Router();

routes.use("/api/auth", authRoutes);
routes.use("/api/messages", messageRoutes);

export { routes };
