import jwt from "jsonwebtoken";

interface UserTokenProps {
  _id: string;
  email: string;
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
}

export const createUserToken = (user: UserTokenProps) => {
  const token = jwt.sign({ sub: user._id, email: user.email }, jwtSecret, {
    expiresIn: "24h",
  });

  return token;
};
