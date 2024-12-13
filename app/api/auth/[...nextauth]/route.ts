import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const runtime = "edge"; // Add this for better performance

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

// Export in the new Next.js route handler format
export const GET = handler;
export const POST = handler;