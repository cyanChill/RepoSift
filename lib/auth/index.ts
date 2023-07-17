import "server-only";
import type { AuthOptions } from "next-auth";
import GithubProvider, { type GithubProfile } from "next-auth/providers/github";
// import GitLabProvider, { type GitLabProfile } from "next-auth/providers/gitlab";

import { ENV } from "@/lib/env-server";

export const authOptions: AuthOptions = {
  providers: [
    // https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/github.ts
    GithubProvider({
      clientId: ENV.GITHUB_ID,
      clientSecret: ENV.GITHUB_SECRET,
      profile: (profile: GithubProfile) => {
        return {
          id: profile.id.toString(),
          username: profile.login,
          image: profile.avatar_url,
          created_at: profile.created_at,
          type: "github",
        };
      },
    }),
    // // https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/gitlab.ts
    // GitLabProvider({
    //   clientId: ENV.GITLAB_ID,
    //   clientSecret: ENV.GITLAB_SECRET,
    //   profile: (profile: GitLabProfile) => {
    //     return {
    //       id: profile.id.toString(),
    //       username: profile.username,
    //       image: profile.avatar_url,
    //       created_at: profile.created_at,
    //       type: "gitlab",
    //     };
    //   },
    // }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.profile = user;
      return token;
    },
    session: ({ session, token }) => {
      if (token && token.profile) session.user = token.profile;
      return session;
    },
  },
  // https://next-auth.js.org/configuration/events
  events: {
    createUser: async (message) => {
      // Can be used to create a User object in our database
      // console.log("\n[Create User]\n");
      // console.log(message);
    },
    signIn: async (message) => {
      // console.log(message);
    },
  },
  pages: {
    signIn: "/join",
  },
  secret: ENV.SECRET,
};
