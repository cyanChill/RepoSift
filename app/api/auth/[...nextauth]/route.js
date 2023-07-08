import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { ENV } from "@/lib/env-server";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: ENV.GITHUB_ID,
      clientSecret: ENV.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/join",
  },
  secret: ENV.SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
