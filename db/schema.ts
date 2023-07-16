import { type InferModel } from "drizzle-orm";
import {
  primaryKey,
  int,
  text,
  varchar,
  timestamp,
  mysqlEnum,
  mysqlTable,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/* https://github.com/drizzle-team/drizzle-orm/tree/main/drizzle-orm/src/mysql-core */
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    handle: varchar("handle", { length: 40 }).notNull().unique(),
    role: mysqlEnum("role", [
      "user",
      "banned",
      "bot",
      "admin",
      "owner",
    ]).default("user"),
    preferred_img: mysqlEnum("preferred_img", [
      "github",
      "gitlab",
      "bitbucket",
    ]).notNull(),
    ban_reason: text("ban_reason"),
    handle_updated_at: timestamp("handle_updated_at").onUpdateNow().notNull(),
  },
  (table) => {
    return {
      handleIndex: uniqueIndex("users__handle__idx").on(table.handle),
    };
  }
);
export type User = InferModel<typeof users>;

export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    username: varchar("username", { length: 256 }).notNull(),
    image: varchar("image", { length: 256 }),
    created_at: timestamp("created_at").notNull(),
    type: text("type"),
    provider: varchar("provider", { length: 256 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 256 }).notNull(),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    id_token: text("id_token"),
    refresh_token: text("refresh_token"),
    scope: varchar("scope", { length: 256 }),
    token_type: varchar("token_type", { length: 256 }),
    session_state: text("session_state"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.id, table.provider),
      providerProviderAccountIdIndex: uniqueIndex(
        "accounts__provider__providerAccountId__idx"
      ).on(table.provider, table.providerAccountId),
      userIdIndex: index("accounts__userId__idx").on(table.userId),
    };
  }
);
export type Account = InferModel<typeof accounts>;

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    expires: timestamp("expires").notNull(),
    sessionToken: varchar("sessionToken", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (table) => {
    return {
      sessionTokenIndex: uniqueIndex("sessions__sessionToken__idx").on(
        table.sessionToken
      ),
      userIdIndex: index("sessions__userId_idx").on(table.userId),
    };
  }
);
export type Session = InferModel<typeof sessions>;

export const verificationTokens = mysqlTable(
  "verificationTokens",
  {
    identifier: varchar("identifier", { length: 256 }).primaryKey().notNull(),
    token: varchar("token", { length: 256 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => {
    return {
      tokenIndex: uniqueIndex("verification_tokens__token__idx").on(
        table.token
      ),
    };
  }
);
export type VerificationToken = InferModel<typeof verificationTokens>;
