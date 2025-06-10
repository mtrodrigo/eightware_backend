import CryptoJS from "crypto-js";

const secretKey = process.env.SECRET_KEY_CRYPTOJS;

export function encryptCPF(cpf: string): string {
  if (!secretKey) {
    throw new Error(
      "SECRET_KEY_CRYPTOJS não definido nas variáveis de ambiente."
    );
  }
  return CryptoJS.AES.encrypt(cpf, secretKey).toString();
}
