import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret:
    process.env.NEXTAUTH_SECRET ||
    "jy3jMWkUMF8w9vTvnOP5TYAZhu26Ll6EFPR2VrkCNQo=",
});
