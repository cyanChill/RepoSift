import NextAuth, { type DefaultSession } from "next-auth";

import type { UserWLinkedAccs } from "@/db/schema/next-auth";

// https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module "next-auth" {
  // Overridden in our providers with the "profile()" option
  interface Profile {
    id: string;
    _id: string;
    username: string;
    image: string;
    created_at: string;
    type: "github" | "gitlab";
  }

  interface User {
    id: string;
    _id: string;
    username: string;
    image: string;
    created_at: string;
    type: "github" | "gitlab";
  }

  interface Session extends DefaultSession {
    /**
     * Data fron the "users" table populated with data from its relation with
     * the "linkedAccounts" table.
     */
    user: UserWLinkedAccs;
  }
}
