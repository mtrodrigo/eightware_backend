process.env.JWT_SECRET = "test-secret-key";
process.env.SECRET_KEY_CRYPTOJS = "test-crypto-key";

import { Request, Response } from "express";
import { UserController } from "./UserController";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { createUserToken } from "../helpers/createUserToken";
import { encryptCPF } from "../utils/encryptCpf";

jest.mock("../models/User");
jest.mock("bcryptjs");
jest.mock("../helpers/createUserToken");
jest.mock("../utils/encryptCpf");

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
        confirmpassword: "123456",
        cpf: "12345678910",
        address: "Rua do Teste",
        number: "12A",
        city: "São Paulo",
        state: "SP",
        zipcode: "01301000",
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
    (User.find as jest.Mock).mockResolvedValue([]);
    (bcrypt.hash as jest.Mock).mockImplementation(async (password: string, saltRounds: number) => {
      return "senhaCriptografada";
    });
    (encryptCPF as jest.Mock).mockReturnValue("cpf-criptografado-123");

    const mockUserInstance = {
      save: jest.fn().mockResolvedValue({
        _id: "123",
        email: "teste@teste.com",
        name: "Teste",
        cpf: "cpf-criptografado-123",
      }),
    };

    (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);
    (createUserToken as jest.Mock).mockReturnValue("token123");

    await UserController.signup(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: "teste@teste.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 12);
    expect(encryptCPF).toHaveBeenCalledWith("12345678910");
    expect(User).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Teste",
        email: "teste@teste.com",
        password: "senhaCriptografada",
        cpf: "cpf-criptografado-123",
        address: "Rua do Teste",
        number: "12A",
        city: "São Paulo",
        state: "SP",
        zipcode: "01301000",
      })
    );
    expect(mockUserInstance.save).toHaveBeenCalled();
    expect(createUserToken).toHaveBeenCalledWith({
      _id: "123",
      email: "teste@teste.com",
    });
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Usuário criado com sucesso",
      token: "token123",
    });
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

    expect(User.findOne).toHaveBeenCalledWith({ email: "teste@teste.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "senhaCriptografada");
    expect(createUserToken).toHaveBeenCalledWith({
      _id: "123",
      email: "teste@teste.com",
    });
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      message: "Login realizado com sucesso",
      token: "tokenLogin",
    });
  });
});
