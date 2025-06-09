import "../config/auth"; 
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserProps } from "../models/User";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: UserProps | false) => {
      if (err || !user) {
        return res.status(400).json({ message: "Não autorizado" });
      }
      req.user = user;

      next();
    }
  )(req, res, next);
};
