import express from "express";
import {
  UserController,
  validateSignupUser,
  validadeLoginUser,
} from "../controllers/UserController";
import { authenticateJwt } from "../middlewares/auth";

const router = express.Router();

router.post("/signup", validateSignupUser, UserController.signup);
router.post("/login", validadeLoginUser, UserController.login);
router.get("/me", authenticateJwt, UserController.getProfile);

export default router;
