import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/signup", authController.signup);

authRoutes.post("/login", authController.login);

authRoutes.post("/logout", authController.logout);

export { authRoutes };
