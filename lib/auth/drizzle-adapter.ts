import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import type { Adapter } from "next-auth/adapters";

import type { DrizzleSchema } from "@/db";
import { users, linkedAccounts, accounts, sessions } from "@/db/schema";
import type { User, LinkedAccount, Account } from "@/db/schema";
import { type AuthProviders } from "../types";

/*
  FIXME: Need to figure out how to update the Adapter type.
*/
export function DrizzleAdapter(
  db: PlanetScaleDatabase<DrizzleSchema>
): Adapter {
  return {
    /* Runs when we "getUserByAccount()" fails to return something. */
    async createUser(data) {
      /*
        Using a transaction as we want to prevent people from creating
        an account that's been linked to someone else's account.
      */
      /*
        TODO: When implementing account linking, logic needs to be updated
              to prevent a new "User" entry from being created.
      */
      console.log("\n[createUser()] data:", data, "\n");

      const id = createId();
      const uniqueHandle = `${data.username}-${id}`;

      await db.transaction(async (tx) => {
        // Create the main user account
        await tx.insert(users).values({
          id: id,
          handle: uniqueHandle,
          role: "user",
          imgSrc: data.type,
          handleUpdatedAt: new Date("2023-07-01T01:00:00.000Z"),
        } as User);
        // Create the linked account
        await tx.insert(linkedAccounts).values({
          id: data._id,
          type: data.type,
          username: data.username,
          image: data.image,
          createdAt: new Date(data.created_at),
          userId: id,
        } as LinkedAccount);
      });

      const user = await db.query.users.findFirst({
        where: eq(users.handle, uniqueHandle),
        with: { linkedAccounts: true },
      });
      if (!user) throw new Error("User not found!");
      return user;
    },

    async getUser(id) {
      console.log("\n[getUser()] id:", id, "\n");

      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: { linkedAccounts: true },
      });
      return user ?? null;
    },

    getUserByEmail(email) {
      console.log("\n[getUserByEmail()] email:", email, "\n");
      /* We don't accept emails with our application */
      return null;
    },

    /* ✅ Runs when we log in. */
    async getUserByAccount({ providerAccountId, provider }) {
      console.log(
        "\n[getUserByAccount()] providerAccountId, provider:",
        providerAccountId,
        provider,
        "\n"
      );

      const account = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.providerAccountId, providerAccountId),
          eq(accounts.provider, provider)
        ),
      });
      if (!account) return null;

      const user = await db.query.users.findFirst({
        where: eq(users.id, account.userId),
        with: { linkedAccounts: true },
      });
      return user ?? null;
    },

    async updateUser(userData) {
      console.log("\n[updateUser()] userData:", userData, "\n");

      if (!userData.id) throw new Error("User not found!");
      /* FIXME: As of now, we'll handle user updates somewhere else. */
      const user = await db.query.users.findFirst({
        where: eq(users.id, userData.id),
        with: { linkedAccounts: true },
      });
      if (!user) throw new Error("User not found!");
      return user;
    },

    /* ❗ Unimplemented Method as of Next-Auth v4.22.1 ❗ */
    async deleteUser(userId) {
      console.log("\n[deleteUser()] userId:", userId, "\n");
      await db.delete(users).where(eq(users.id, userId));
      await db.delete(linkedAccounts).where(eq(linkedAccounts.userId, userId));
    },

    /* Run after "createUser()" runs. */
    async linkAccount(accountData) {
      console.log("\n[linkAccount()] account:", accountData, "\n");

      await db.insert(accounts).values({
        id: createId(),
        userId: accountData.userId,
        type: accountData.type,
        provider: accountData.provider,
        providerAccountId: accountData.providerAccountId,
        access_token: accountData.access_token,
        token_type: accountData.token_type,
        scope: accountData.scope,
        refresh_token: accountData.refresh_token,
        expires_at: accountData.expires_at,
        id_token: accountData.id_token,
      } as Account);
    },

    /* ❗ Unimplemented Method as of Bext-Auth v4.22.1 ❗ */
    async unlinkAccount({ providerAccountId, provider }) {
      console.log(
        "\n[unlinkAccount()] providerAccountId, provider:",
        providerAccountId,
        provider,
        "\n"
      );

      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        );
      await db
        .delete(linkedAccounts)
        .where(
          and(
            eq(linkedAccounts.id, providerAccountId),
            eq(linkedAccounts.type, provider as AuthProviders)
          )
        );
    },

    /* ✅ Runs when we log in on a new device. */
    async createSession(newSession) {
      console.log("\n[createSession()] newSession:", newSession, "\n");

      await db.insert(sessions).values({
        id: createId(),
        expires: newSession.expires,
        sessionToken: newSession.sessionToken,
        userId: newSession.userId,
      });

      const session = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, newSession.sessionToken),
      });
      if (!session) throw new Error("Session not found!");
      return session;
    },

    /* ✅ Runs whenever we open the tab with our site. */
    async getSessionAndUser(sessionToken) {
      console.log("\n[getSessionAndUser()] sessionToken:", sessionToken, "\n");

      const session = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, sessionToken),
      });
      if (!session) return null;

      const user = await db.query.users.findFirst({
        where: eq(users.id, session.userId),
        with: { linkedAccounts: true },
      });
      if (!user) return null;
      return { session, user };
    },

    async updateSession(session) {
      console.log("\n[updateSession()] session:", session, "\n");

      const { sessionToken } = session;
      await db
        .update(sessions)
        .set(session)
        .where(eq(sessions.sessionToken, sessionToken));

      const updatedSession = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, sessionToken),
      });
      if (!updatedSession) throw new Error("Updated Session not found!");
      return updatedSession;
    },

    /* ✅ Runs when we log out. */
    async deleteSession(sessionToken) {
      console.log("\n[deleteSession()] sessionToken:", sessionToken, "\n");
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
  };
}
