import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: "Iv1.ceae329b235b6413",
      clientSecret: "607f5b2305cdc0f5bf60c9e57063605ec85d4fc4",
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session?.user?.name
        .split("")
        .join("")
        .toLowerCase();
      session.user.uid = token.sub;
      return session;
    },
  },
  secret: "default_secret_key",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
