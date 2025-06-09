import { z } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Campo nome está vazio"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
      confirmpassword: z.string().min(1, "Campo confirmar senha está vazio"),
    })
    .refine((data) => data.password === data.confirmpassword, {
      message: "A senha e a confirmação de senha são diferentes",
      path: ["confirmpassword"],
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
