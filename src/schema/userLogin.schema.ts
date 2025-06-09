import { z } from "zod";

export const createUserLoginSchema = z.object({
  body: z
    .object({
      email: z.string().email("E-mail inválido").min(1, "O campo e-mail está vazio"),
      password: z.string().min(1, "Compo senha está vazio"),
    })
});

export type CreateUserInput = z.infer<typeof createUserLoginSchema>;
