import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { create } from "domain";
import { createUserToken } from "../helpers/createUserToken";

export default class UserController {
  static async signup(req: Request, res: Response) {
    if (!req.body) {
      return res.status(401).json({ message: "Requisição vazia" });
    }

    const { name, email, password, confirmpassword } = req.body;

    //validation
    if (!name) {
      res.status(422).json({ message: "Campo nome está vazio" });
    }
    if (!email) {
      res.status(422).json({ message: "Campo e-mail está vazio" });
    }
    if (!password) {
      res.status(422).json({ message: "Campo senha está vazio" });
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "Campo confirmar senha está vazio" });
    }

    if (password !== confirmpassword) {
      res
        .status(422)
        .json({ message: "A senha e a confirmação de senha saõ diferentes" });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: "E-mail-invãilido, use outro" });
    }

    //encrypt password
    const passwordEncrypted = await bcrypt.hash(password, 12);

    //Create User
    const user = new User({
      name,
      email,
      password: passwordEncrypted,
    });

    try {
      const newUser = await user.save();
      const token = createUserToken({
        _id: newUser._id?.toString() || "",
        email: newUser.email || "",
      });
      return res.status(201).json({ message: "Usuário criado com sucesso", token });
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }
  }
}
