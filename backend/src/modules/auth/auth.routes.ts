import { Router } from "express";
import { register, login, refresh, logout, me } from "./auth.controller.js";
import validate from "../../common/middlewares/validate.middlewares.js";
import { RegisterDTO, LoginDTO } from "./auth.dto.js";
import { authenticateUser } from "../../common/middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", validate(RegisterDTO), register);
router.post("/login", validate(LoginDTO), login);

// To get new set of tokens
router.post("/refresh", refresh);

// Protected / Session routes
router.post("/logout", logout);
router.get("/me", authenticateUser, me);

export default router;
