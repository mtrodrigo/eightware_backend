import CryptoJS from "crypto-js";

const secretKey = process.env.SECRET_KEY_CRYPTOJS;

export function decryptCPF(encryptedCPF: string): string {
  if (!secretKey) {
    throw new Error(
      "SECRET_KEY_CRYPTOJS não definido nas variáveis de ambiente."
    );
  }
  const bytes = CryptoJS.AES.decrypt(encryptedCPF, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
