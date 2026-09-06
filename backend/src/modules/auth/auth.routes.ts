import { Router } from "express";
import { register, login, refresh, logout, profile } from "./auth.controller.js";
import validate from "../../common/middlewares/validate.middlewares.js";
import { RegisterDTO, LoginDTO } from "./auth.dto.js";
import { authenticateUser } from "../../common/middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", validate(RegisterDTO), register);
router.post("/login", validate(LoginDTO), login);

// To get new set of tokens
router.post("/refresh", refresh);

// Protected routes (Require valid access token)
router.post("/logout", authenticateUser, logout);
router.get("/profile", authenticateUser, profile);

export default router;
