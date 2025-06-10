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
        password: "123456",
      },
    };

    res = {
      status: mockStatus,
      json: mockJson,
    };

    jest.clearAllMocks();
  });

  it("deve criar usuário com sucesso e gerar o token", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    (bcrypt.hash as jest.Mock).mockResolvedValue("senhaCriptografada");

    const mockSave = jest.fn().mockResolvedValue({
      _id: "123",
      email: "teste@teste.com",
    });
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    (createUserToken as jest.Mock).mockReturnValue("token123");

    await UserController.signup(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Usuário criado com sucesso",
      token: "token123",
    });
  });

  describe("UserController - login", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });

      req = {
        body: {
          email: "teste@teste.com",
          password: "123456",
        },
      };

      res = {
        status: mockStatus,
        json: mockJson,
      };

      jest.clearAllMocks();
    });

    it("deve fazer login e gerar o token", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "123",
        email: "teste@teste.com",
        password: "senhaCriptografada",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (createUserToken as jest.Mock).mockReturnValue("tokenLogin");

      await UserController.login(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Login realizado com sucesso",
        token: "tokenLogin",
      });
      expect(createUserToken).toHaveBeenCalledWith({
        _id: "123",
        email: "teste@teste.com",
      });
    });
  });
});
