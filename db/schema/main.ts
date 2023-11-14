/* https://github.com/drizzle-team/drizzle-orm/tree/main/drizzle-orm/src/mysql-core */
import { relations, sql } from "drizzle-orm";
import {
  primaryKey,
  int,
  text,
  varchar,
  timestamp,
  mysqlEnum,
  mysqlTable,
  boolean,
} from "drizzle-orm/mysql-core";

import { users, type SelectUser } from "./next-auth";

/* Programming languages [Automatically Inserted] */
export const languages = mysqlTable("languages", {
  name: varchar("name", { length: 128 }).primaryKey().notNull(),
  display: varchar("display", { length: 128 }).notNull(),
});
export const languageRelations = relations(languages, ({ many }) => ({
  repoLanguages: many(repoLangs),
}));
export type SelectLanguage = typeof languages.$inferSelect;

/* Labels used to index repositories better */
export const labels = mysqlTable("labels", {
  name: varchar("name", { length: 128 }).primaryKey().notNull(),
  display: varchar("display", { length: 128 }).notNull(),
  type: mysqlEnum("type", ["primary", "regular"]).default("regular").notNull(),
  userId: varchar("userId", { length: 256 }).notNull(), // Suggester
});
export const labelRelations = relations(labels, ({ one, many }) => ({
  user: one(users, { fields: [labels.userId], references: [users.id] }),
  repositories: many(repositories), // As a primary label
  repoLabels: many(repoLabels), // As "regular" labels
}));
export type SelectLabel = typeof labels.$inferSelect;
export interface LabelWUser extends SelectLabel {
  user: SelectUser;
}

/* Information about repository we'll store in our database */
export const repositories = mysqlTable("repositories", {
  _pk: varchar("_pk", { length: 512 }).primaryKey().notNull(), // "{id}|{type}"
  id: varchar("id", { length: 256 }).notNull(),
  type: mysqlEnum("type", ["github", "gitlab", "bitbucket"]).notNull(),
  author: varchar("author", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  stars: int("stars").default(0),
  maintainLink: text("maintainLink"),
  _primaryLabel: varchar("_primary_label", { length: 128 }).notNull(),
  userId: varchar("userId", { length: 256 }).notNull(), // Suggester
  lastUpdated: timestamp("lastUpdated").notNull(),
});
export const repositoryRelations = relations(repositories, ({ one, many }) => ({
  user: one(users, { fields: [repositories.userId], references: [users.id] }),
  primaryLabel: one(labels, {
    fields: [repositories._primaryLabel],
    references: [labels.name],
  }),
  labels: many(repoLabels),
  languages: many(repoLangs),
}));
export type SelectBaseRepository = typeof repositories.$inferSelect;
export interface Repository extends SelectBaseRepository {
  user: SelectUser;
  primaryLabel: SelectLabel;
  labels: RepoLabelWLabel[];
  languages: RepoLangWLang[];
}

/*
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                          Repository Relations
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
/* Labels assigned to repositories */
export const repoLabels = mysqlTable(
  "repoLabels",
  {
    name: varchar("name", { length: 128 }).notNull(),
    repoPK: varchar("repoPK", { length: 512 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.name, table.repoPK] }),
  }),
);
export const repoLabelRelations = relations(repoLabels, ({ one }) => ({
  label: one(labels, {
    fields: [repoLabels.name],
    references: [labels.name],
  }),
  repository: one(repositories, {
    fields: [repoLabels.repoPK],
    references: [repositories._pk],
  }),
}));
export type SelectRepoLabel = typeof repoLabels.$inferSelect;
export interface RepoLabelWLabel extends SelectRepoLabel {
  label?: SelectLabel;
}

/* Languages automatically assigned to repositories on creation */
export const repoLangs = mysqlTable(
  "repoLangs",
  {
    name: varchar("name", { length: 128 }).notNull(),
    repoPK: varchar("repoPK", { length: 512 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.name, table.repoPK] }),
  }),
);
export const repoLangRelations = relations(repoLangs, ({ one }) => ({
  language: one(languages, {
    fields: [repoLangs.name],
    references: [languages.name],
  }),
  repository: one(repositories, {
    fields: [repoLangs.repoPK],
    references: [repositories._pk],
  }),
}));
export type SelectRepoLanguage = typeof repoLangs.$inferSelect;
export interface RepoLangWLang extends SelectRepoLanguage {
  language?: SelectLanguage;
}

/*
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                            Reports & Logs
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
export const reports = mysqlTable("reports", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  userId: varchar("userId", { length: 256 }).notNull(), // Reporter
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
export const reportRelations = relations(reports, ({ one }) => ({
  user: one(users, { fields: [reports.userId], references: [users.id] }),
}));

export const logs = mysqlTable("logs", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  action: text("action").notNull(),
  reportId: varchar("reportId", { length: 256 }),
  userId: varchar("userId", { length: 256 }).notNull(), // Action Handled By
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
export const logRelation = relations(logs, ({ one }) => ({
  user: one(users, { fields: [logs.userId], references: [users.id] }),
  report: one(reports, { fields: [logs.reportId], references: [reports.id] }),
}));
