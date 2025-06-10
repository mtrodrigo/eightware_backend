process.env.JWT_SECRET = "test-secret-key";
process.env.CRYPTO_SECRET = "test-crypto-key";

import { Request, Response } from "express";
import { UserController } from "./UserController";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { createUserToken } from "../helpers/createUserToken";
import CryptoJS from "crypto-js";

jest.mock("../models/User");
jest.mock("bcryptjs");
jest.mock("../helpers/createUserToken");
jest.mock("crypto-js");

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    res = {
      status: mockStatus,
      json: mockJson,
    };

    // Configuração do mock do CryptoJS
    jest.spyOn(CryptoJS.AES, "encrypt").mockImplementation(() => ({
      ciphertext: {} as any,
      key: {} as any,
      iv: {} as any,
      salt: {} as any,
      algorithm: {} as any,
      mode: {} as any,
      padding: {} as any,
      blockSize: 4,
      formatter: {} as any,
      toString: () => "encrypted-cpf-123",
    }));

    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("deve criar usuário com sucesso e retornar token JWT", async () => {
      // Configuração da requisição
      req = {
        body: {
          name: "Teste",
          email: "teste@teste.com",
          password: "123456",
          cpf: "12345678909",
          address: "Rua Exemplo",
          number: "123",
          city: "São Paulo",
          state: "SP",
          zipcode: "01001000",
        },
      };

      // Mock das dependências
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      (createUserToken as jest.Mock).mockReturnValue("generated-jwt-token");

      const mockSave = jest.fn().mockResolvedValue({
        _id: "user123",
        email: "teste@teste.com",
        cpf: "encrypted-cpf-123",
        // outros campos...
      });

      (User as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      // Execução
      await UserController.signup(req as Request, res as Response);

      // Verificações
      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@teste.com" });
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(
        "12345678909",
        "test-crypto-key"
      );
      expect(mockSave).toHaveBeenCalled();
      expect(createUserToken).toHaveBeenCalledWith({
        _id: "user123",
        email: "teste@teste.com",
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Usuário criado com sucesso",
        token: "generated-jwt-token",
      });
    });

  describe("login", () => {
    beforeEach(() => {
      req = {
        body: {
          email: "teste@teste.com",
          password: "123456",
        },
      };

      // Mock da descriptografia
      jest.spyOn(CryptoJS.AES, "decrypt").mockImplementation(() => ({
        words: [],
        sigBytes: 0,
        toString: () => "12345678909",
        concat: () => {
          throw new Error("not implemented");
        },
        clamp: () => {
          throw new Error("not implemented");
        },
        clone: () => {
          throw new Error("not implemented");
        },
      }));
    });

    it("deve fazer login com sucesso e retornar token JWT", async () => {
      // Mock do usuário existente
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "user123",
        email: "teste@teste.com",
        password: "hashed-password",
        cpf: "encrypted-cpf-123",
        // outros campos...
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (createUserToken as jest.Mock).mockReturnValue("generated-jwt-token");

      await UserController.login(req as Request, res as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@teste.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed-password");
      expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(
        "encrypted-cpf-123",
        "test-crypto-key"
      );
      expect(createUserToken).toHaveBeenCalledWith({
        _id: "user123",
        email: "teste@teste.com",
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Login realizado com sucesso",
        token: "generated-jwt-token",
      });
    });

    it("não deve fazer login com credenciais inválidas", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "teste@teste.com",
        password: "hashed-password",
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await UserController.login(req as Request, res as Response);

      expect(mockStatus).toHaveBeenCalledWith(422);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Senha inválida!",
      });
    });
  });
});
