import { z } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Campo nome está vazio"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
      confirmpassword: z.string().min(1, "Campo confirmar senha está vazio"),
      cpf: z
        .string()
        .length(11, "CPF deve ter exatamente 11 dígitos")
        .regex(/^\d+$/, "CPF deve conter apenas números"),
      address: z
        .string()
        .min(3, "Endereço deve ter no mínimo 3 caracteres")
        .max(200, "Endereço deve ter no máximo 200 caracteres"),
      number: z
        .string()
        .min(1, "Número deve ter no mínimo 1 caractere")
        .max(10, "Número deve ter no máximo 10 caracteres"),
      city: z
        .string()
        .min(2, "Cidade deve ter no mínimo 2 caracteres")
        .max(100, "Cidade deve ter no máximo 100 caracteres"),
      state: z.string().length(2, "Estado deve ter exatamente 2 caracteres"),
      zipcode: z
        .string()
        .length(8, "CEP deve ter exatamente 8 dígitos")
        .regex(/^\d+$/, "CEP deve conter apenas números"),
    })
    .refine((data) => data.password === data.confirmpassword, {
      message: "A senha e a confirmação de senha são diferentes",
      path: ["confirmpassword"],
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
