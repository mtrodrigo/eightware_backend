import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { createUserToken } from "../helpers/createUserToken";
import { createUserSchema } from "../schema/userSingup.schema";
import { createUserLoginSchema } from "../schema/userLogin.schema";
import { validate } from "../middlewares/validate";

export class UserController {
  static async signup (req: Request, res: Response) {
    try {
      const { name, email, password, confirmpassword } = req.body;

      //check user exists
      const userExists = await User.findOne({ email: email });
      if (userExists) {
        res.status(422).json({ message: "E-mail-inválido, use outro" });
        return;
      }

      //encrypt password
      const passwordEncrypted = await bcrypt.hash(password, 12);

      //Create User
      const user = new User({
        name,
        email,
        password: passwordEncrypted,
      });

      const newUser = await user.save();
      const token = createUserToken({
        _id: newUser._id?.toString() || "",
        email: newUser.email || "",
      });
      res.status(201).json({ message: "Usuário criado com sucesso", token });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ message: "Erro ao cadastrar usuário: ", error });
    }
  };

  static async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    //check user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Credenciais inválidas" });
      return
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return
    }

    const token = createUserToken({
      _id: user._id?.toString() || "",
      email: user.email || "",
    });

    res.status(200).json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Erro ao realizar login: ", error });
  }
}

  static async getProfile (req: Request, res: Response) {}
}

export const validateSignupUser = validate(createUserSchema)
export const validadeLoginUser = validate(createUserLoginSchema)
