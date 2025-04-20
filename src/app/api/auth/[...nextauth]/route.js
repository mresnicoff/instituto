import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google";
const prisma = new PrismaClient();

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly', // Asegúrate de que este scope está incluido
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("Autorizando usuario con email:", credentials.email);
          const user = await prisma.instusuario.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("El usuario no existe");
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.passhasheada);
          
          if (!isValidPassword) {
            console.log("Contraseña incorrecta");
            return null;
          }

          return { 
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            avatar: user.avatar,
            rol: user.rol,
          };
        } catch (error) {
          console.error("Error en la autenticación:", error);
          return null;
        }
      }
    }),

  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token ) {
        session.user = {
          id: token.id,
          email: token.email,
          nombre: token.nombre,
          avatar: token.avatar,
          rol: token.rol,
        };
        if (token.provider === 'google') {
          // Actualizamos con información de Google
          session.user.nombre = token.name || session.user.nombre;
          session.user.avatar = token.picture || session.user.avatar;
          session.user.email = token.email || session.user.avatar;
          session.accessToken = token.accessToken;
          session.expiresAt = token.expires_at; // Tiempo de expiración del access token
          session.refreshToken = token.refreshToken; // Para refrescar el token cuando expire
        }

      }

      return session;
    },
    jwt: async ({ token, user, account, profile }) => {
      if (account && account.provider === 'google') {
        // Autenticación de Google
        return {
          ...token, // Mantenemos cualquier dato existente
          id: profile.sub, // Google usa 'sub' para el ID del usuario
          email: profile.email,
          nombre: profile.name,
          avatar: profile.picture,
          provider: 'google', // Añadimos esto para identificación
          accessToken: account.access_token,
          // También podrías añadir el refresh_token si lo necesitas
          refreshToken: account.refresh_token,
          // Y los tiempos de expiración si los provee Google
          expires_at: Date.now() + (Number(account.expires_in) * 1000),
        };
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nombre = user.nombre;
        token.avatar = user.avatar;
        token.rol = user.rol;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

