/* https://github.com/drizzle-team/drizzle-orm/tree/main/drizzle-orm/src/pg-core */
import { relations, sql } from "drizzle-orm";
import {
  primaryKey,
  integer,
  text,
  varchar,
  timestamp,
  pgEnum,
  pgTable,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { labels, repositories, providerTypeEnum } from "./main";

/*
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                              Next-Auth Tables
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
export const userRoleEnum = pgEnum("userRole", [
  "user",
  "banned",
  "bot",
  "admin",
  "owner",
]);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    name: varchar("name", { length: 128 }).default("RepoSift User").notNull(),
    handle: varchar("handle", { length: 256 }).notNull(),
    handleLower: varchar("handleLower", { length: 256 }).unique().notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    imgSrc: providerTypeEnum("imgSrc").notNull(),
    banReason: text("banReason"),
    nameUpdatedAt: timestamp("nameUpdatedAt")
      .default(new Date("2023-07-01T01:00:00.000Z"))
      .notNull(),
    handleUpdatedAt: timestamp("handleUpdatedAt")
      .default(new Date("2023-07-01T01:00:00.000Z"))
      .notNull(),
  },
  (table) => [uniqueIndex("users__handleLower__idx").on(table.handleLower)],
);
export const userRelations = relations(users, ({ many }) => ({
  linkedAccounts: many(linkedAccounts),
  accounts: many(accounts),
  sessions: many(sessions),
  contributedLabels: many(labels),
  contributedRepos: many(repositories),
}));
export type SelectUser = typeof users.$inferSelect;
export interface UserWLinkedAccs extends SelectUser {
  linkedAccounts: SelectLinkedAcc[];
}

// A "LinkedAccount" entry should be created right after we create a "User" entry.
export const linkedAccounts = pgTable(
  "linkedAccounts",
  {
    id: varchar("id", { length: 256 }).notNull(),
    type: providerTypeEnum("type").notNull(),
    username: varchar("username", { length: 256 }).notNull(),
    image: varchar("image", { length: 256 }),
    createdAt: timestamp("createdAt").notNull(),
    lastUpdated: timestamp("lastUpdated")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.type] }),
    index("linkedAccounts__userId__idx").on(table.userId),
  ],
);
export const linkedAccountRelations = relations(linkedAccounts, ({ one }) => ({
  user: one(users, { fields: [linkedAccounts.userId], references: [users.id] }),
}));
export type SelectLinkedAcc = typeof linkedAccounts.$inferSelect;

export const accounts = pgTable(
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
    expires_at: integer("expires_at"),
    id_token: text("id_token"),
  },
  (table) => [
    uniqueIndex("accounts__provider__providerAccountId__idx").on(
      table.provider,
      table.providerAccountId,
    ),
    index("accounts__userId__idx").on(table.userId),
  ],
);
export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    expires: timestamp("expires").notNull(),
    sessionToken: varchar("sessionToken", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (table) => [
    uniqueIndex("sessions__sessionToken__idx").on(table.sessionToken),
    index("sessions__userId_idx").on(table.userId),
  ],
);
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
export type SelectSession = typeof sessions.$inferSelect;
