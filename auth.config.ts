import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === '/login';
      if (!isLoggedIn && !isLoginPage) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL('/inicio', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;