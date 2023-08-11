/* https://github.com/drizzle-team/drizzle-orm/tree/main/drizzle-orm/src/mysql-core */
import { relations, type InferModel } from "drizzle-orm";
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

import { labels, repositories } from "./main";
import type { Label, Repository } from "./main";

/*
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                              Next-Auth Tables
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    name: varchar("name", { length: 64 }).default("RepoSift User").notNull(),
    handle: varchar("handle", { length: 64 }).unique().notNull(),
    role: mysqlEnum("role", ["user", "banned", "bot", "admin", "owner"])
      .default("user")
      .notNull(),
    imgSrc: mysqlEnum("imgSrc", ["github", "gitlab", "bitbucket"]).notNull(),
    banReason: text("banReason"),
    handleUpdatedAt: timestamp("handleUpdatedAt").notNull(),
  },
  (table) => ({
    handleIndex: uniqueIndex("users__handle__idx").on(table.handle),
  })
);
export type User = InferModel<typeof users>;
export const userRelations = relations(users, ({ many }) => ({
  linkedAccounts: many(linkedAccounts),
  accounts: many(accounts),
  sessions: many(sessions),
  contributedLabels: many(labels),
  contributedRepos: many(repositories),
}));
export type UserWithLinkedAccounts = User & { linkedAccounts: LinkedAccount[] };
export type UserWithContributions = UserWithLinkedAccounts & {
  contributedLabels: Label[];
  contributedRepos: Repository[];
};

// A "LinkedAccount" entry should be created right after we create a "User" entry.
export const linkedAccounts = mysqlTable(
  "linkedAccounts",
  {
    id: varchar("id", { length: 256 }).notNull(),
    type: mysqlEnum("type", ["github", "gitlab", "bitbucket"]).notNull(),
    username: varchar("username", { length: 256 }).notNull(),
    image: varchar("image", { length: 256 }),
    createdAt: timestamp("createdAt").notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.id, table.type),
    userIdIndex: index("linkedAccounts__userId__idx").on(table.userId),
  })
);
export type LinkedAccount = InferModel<typeof linkedAccounts>;
export const linkedAccountRelations = relations(linkedAccounts, ({ one }) => ({
  user: one(users, { fields: [linkedAccounts.userId], references: [users.id] }),
}));

export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    type: varchar("type", { length: 256 }).notNull(),
    provider: varchar("provider", { length: 256 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 256 }).notNull(),
    access_token: text("access_token"),
    token_type: varchar("token_type", { length: 256 }),
    scope: varchar("scope", { length: 256 }),
    refresh_token: text("refresh_token"),
    expires_at: int("expires_at"),
    id_token: text("id_token"),
  },
  (table) => ({
    providerProviderAccountIdIndex: uniqueIndex(
      "accounts__provider__providerAccountId__idx"
    ).on(table.provider, table.providerAccountId),
    userIdIndex: index("accounts__userId__idx").on(table.userId),
  })
);
export type Account = InferModel<typeof accounts>;
export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    expires: timestamp("expires").notNull(),
    sessionToken: varchar("sessionToken", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (table) => ({
    sessionTokenIndex: uniqueIndex("sessions__sessionToken__idx").on(
      table.sessionToken
    ),
    userIdIndex: index("sessions__userId_idx").on(table.userId),
  })
);
export type Session = InferModel<typeof sessions>;
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
