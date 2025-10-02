import { Router } from "express";

const authRoutes = Router();

authRoutes.get("/signup", (req, res) => {
  res.send("Signup");
});

authRoutes.get("/signin", (req, res) => {
  res.send("Signin");
});

authRoutes.get("/logout", (req, res) => {
  res.send("Signout");
});

export { authRoutes };
