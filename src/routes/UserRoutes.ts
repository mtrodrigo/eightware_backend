import express from "express";
import {UserController, validateSignupUser, validadeLoginUser} from "../controllers/UserController";

const router = express.Router();

router.post("/signup", validateSignupUser, UserController.signup);
router.post("/login", validadeLoginUser, UserController.login)

export default router;
