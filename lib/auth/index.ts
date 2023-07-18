import "server-only";
import type { AuthOptions } from "next-auth";
import GithubProvider, { type GithubProfile } from "next-auth/providers/github";
// import GitLabProvider, { type GitLabProfile } from "next-auth/providers/gitlab";

import { db } from "@/db";
import { ENV } from "@/lib/env-server";
import { DrizzleAdapter } from "./drizzle-adapter";

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    // https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/github.ts
    GithubProvider({
      clientId: ENV.GITHUB_ID,
      clientSecret: ENV.GITHUB_SECRET,
      profile: (profile: GithubProfile) => {
        return {
          id: profile.id.toString(),
          _id: profile.id.toString(),
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
    //       _id: profile.id.toString(),
    //       username: profile.username,
    //       image: profile.avatar_url,
    //       created_at: profile.created_at,
    //       type: "gitlab",
    //     };
    //   },
    // }),
  ],
  callbacks: {
    session: ({ session, user }) => {
      // @ts-ignore: User returned from Drizzle Adapter is of correct form.
      //             Just need to figure out how to fix the Adapter type.
      if (user) session.user = user;
      return session;
    },
  },
  pages: {
    signIn: "/join",
  },
  secret: ENV.SECRET,
};
