import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { arcjetProtection } from "@/middlewares/arcjet-middleware";

const authRoutes = Router();
const authController = new AuthController();
authRoutes.use(arcjetProtection);

// Protect route
// authRoutes.get("/test", arcjetProtection, (req, res) => {
//   res.status(200).json({ message: "Teste route" });
// });
authRoutes.post("/signup", authController.signup);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authController.logout);
authRoutes.put(
  "/update-profile",
  ensureAuthenticated,
  authController.updateProfile
);

authRoutes.put("/check", ensureAuthenticated, (req, res) =>
  res.status(200).json(req.user)
);

export { authRoutes };
