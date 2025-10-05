import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, { error: "Campo obrigatório" }).max(255),
  email: z.email(),
  password: z
    .string()
    .min(6, { error: "Senha precisa ter pelo menos 6 caracteres" }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
