process.env.JWT_SECRET = "test-secret-key";

import { Request, Response } from "express";
import { UserController } from "./UserController";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { createUserToken } from "../helpers/createUserToken";

jest.mock("../models/User");
jest.mock("bcryptjs");
jest.mock("../helpers/createUserToken");

describe("UserController - signup", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    req = {
      body: {
        name: "Teste",
        email: "teste@teste.com",
        password: "123456"
      }
    };
    
    res = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  it("deve criar usuário com sucesso", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    
    (bcrypt.hash as jest.Mock).mockResolvedValue("senhaCriptografada");
    
    const mockSave = jest.fn().mockResolvedValue({
      _id: "123",
      email: "teste@teste.com"
    });
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave
    }));
    
    (createUserToken as jest.Mock).mockReturnValue("token123");

    await UserController.signup(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Usuário criado com sucesso",
      token: "token123"
    });
  });

  it("deve retornar erro se usuário já existe", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: "joao@test.com" });

    await UserController.signup(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(422);
    expect(mockJson).toHaveBeenCalledWith({
      message: "E-mail-inválido, use outro"
    });
  });

  it("deve retornar erro 500 em caso de falha", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Erro no banco"));
    
    jest.spyOn(console, "error").mockImplementation();

    await UserController.signup(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Erro ao cadastrar usuário: ",
      error: expect.any(Error)
    });
  });
});