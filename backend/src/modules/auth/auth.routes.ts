import { Router } from "express";
import { register, login, refresh, logout, profile } from "./auth.controller.js";
import validate from "../../common/middlewares/validate.middlewares.js";
import { RegisterDTO, LoginDTO } from "./auth.dto.js";
import { authenticateUser } from "./auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", validate(RegisterDTO), register);
router.post("/login", validate(LoginDTO), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Protected routes (Require valid access token)
router.get("/profile", authenticateUser, profile);

export default router;
