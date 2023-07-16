import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

// https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module "next-auth" {
  // Overridden in our providers with the "profile()" option
  interface Profile {
    id: string;
    username: string;
    image: string;
    created_at: string;
    type: "github" | "gitlab";
  }

  interface User {
    id: string;
    username: string;
    image: string;
    created_at: string;
    type: "github" | "gitlab";
  }

  // Overide the default "user" value with what's returned by "profile()"
  interface Session extends DefaultSession {
    /** The user's "profile()" value. */
    user: {
      id: string;
      username: string;
      image: string;
      created_at: string;
      type: "github" | "gitlab";
    };
  }
}

// https://next-auth.js.org/getting-started/typescript#submodules
declare module "next-auth/jwt" {
  // Returned by the `jwt` callback and `getToken`, when using JWT sessions
  interface JWT extends DefaultJWT {
    profile: {
      id: string;
      username: string;
      image: string;
      created_at: string;
      type: "github" | "gitlab";
    };
  }
}
