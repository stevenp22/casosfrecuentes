import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { buscarUsuario } from "./app/lib/actions";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ documento: z.string(), contraseña: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { documento, contraseña } = parsedCredentials.data;
          const user = await buscarUsuario(documento);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(
            contraseña,
            user.contraseña
          );

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
