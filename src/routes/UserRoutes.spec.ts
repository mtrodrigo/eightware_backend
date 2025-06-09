import request from "supertest";
import express from "express";
import UserRoutes from "./UserRoutes";

jest.mock("../controllers/UserController", () => {
  return {
    UserController: {
      getProfile: (req: any, res: any) => res.status(200).json({ user: "mockUser" }),
      signup: jest.fn((req: any, res: any) => res.status(201).json({})),
      login: jest.fn((req: any, res: any) => res.status(200).json({})),
    },
    validateSignupUser: (req: any, res: any, next: any) => next(),
    validadeLoginUser: (req: any, res: any, next: any) => next(),
  };
});

jest.mock("../middlewares/auth", () => ({
  authenticateJwt: (req: any, res: any, next: any) => {
    if (req.headers.authorization === "Bearer validtoken") {
      req.user = { id: "123", email: "teste@teste.com" };
      return next();
    }
    return res.status(400).json({ message: "Não autorizado" });
  },
}));

const app = express();
app.use(express.json());
app.use("/users", UserRoutes);

describe("GET /users/me", () => {
  it("deve retornar 200 e o usuário quando o token é válido", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer validtoken");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: "mockUser" });
  });

  it("deve retornar 400 quando o token não é enviado", async () => {
    const res = await request(app).get("/users/me");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Não autorizado" });
  });
});

