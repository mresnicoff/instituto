// src/app/api/auth/[...nextauth]/route.js
import NextAuthModule from 'next-auth';
import CredentialsProviderModule from 'next-auth/providers/credentials';
import GoogleProviderModule from 'next-auth/providers/google';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Access default exports
const NextAuth = NextAuthModule.default || NextAuthModule;
const CredentialsProvider = CredentialsProviderModule.default || CredentialsProviderModule;
const GoogleProvider = GoogleProviderModule.default || GoogleProviderModule;

// Debug imports
console.log('NextAuth:', NextAuth);
console.log('GoogleProvider:', GoogleProvider);
console.log('CredentialsProvider:', CredentialsProvider);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('Authorizing user with email:', credentials.email);
          const user = await prisma.instusuario.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log('User does not exist');
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.passhasheada);
          
          if (!isValidPassword) {
            console.log('Incorrect password');
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
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          nombre: token.nombre,
          avatar: token.avatar,
          rol: token.rol,
        };
        if (token.provider === 'google') {
          session.user.nombre = token.name || session.user.nombre;
          session.user.avatar = token.picture || session.user.avatar;
          session.user.email = token.email || session.user.email;
          session.accessToken = token.accessToken;
          session.expiresAt = token.expires_at;
          session.refreshToken = token.refreshToken;
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (account && account.provider === 'google') {
        return {
          ...token,
          id: profile.sub,
          email: profile.email,
          nombre: profile.name,
          avatar: profile.picture,
          provider: 'google',
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expires_at: account.expires_in ? Date.now() + Number(account.expires_in) * 1000 : undefined,
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
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };