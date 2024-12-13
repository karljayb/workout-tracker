import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Add allowed users
const allowedUsers = [
  // Add your GitHub email
  "karl.bennett@gmail.com",
  // Add more emails if needed
];

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email is in the allowed list
      return allowedUsers.includes(user.email?.toLowerCase() ?? "");
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Will redirect to login page with error
  },
});

export { handler as GET, handler as POST };