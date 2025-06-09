import express from "express";
import {UserController, validateSignupUser} from "../controllers/UserController";

const router = express.Router();

router.post("/signup", validateSignupUser, UserController.signup);
router.post("/login", UserController.login)

export default router;
