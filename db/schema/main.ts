/* https://github.com/drizzle-team/drizzle-orm/tree/main/drizzle-orm/src/mysql-core */
import { relations, sql, type InferModel } from "drizzle-orm";
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

import { users, type User } from "./next-auth";

/* Programming languages [Automatically Inserted] */
export const languages = mysqlTable("languages", {
  name: varchar("name", { length: 128 }).primaryKey().notNull(),
  display: varchar("display", { length: 128 }).notNull(),
});
export type Language = InferModel<typeof languages>;
export const languageRelations = relations(languages, ({ many }) => ({
  repoLanguages: many(repoLangs),
}));

/* Labels used to index repositories better */
export const labels = mysqlTable("labels", {
  name: varchar("name", { length: 128 }).primaryKey().notNull(),
  display: varchar("display", { length: 128 }).notNull(),
  type: mysqlEnum("type", ["primary", "regular"]).default("regular").notNull(),
  userId: varchar("userId", { length: 256 }).notNull(), // Suggester
});
export type Label = InferModel<typeof labels>;
export const labelRelations = relations(labels, ({ one, many }) => ({
  user: one(users, { fields: [labels.userId], references: [users.id] }),
  repositories: many(repositories), // As a primary label
  repoLabels: many(repoLabels), // As "regular" labels
}));
export type LabelWithUser = Label & { user: User };

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
export type BaseRepositoryType = InferModel<typeof repositories>;
export const repositoryRelations = relations(repositories, ({ one, many }) => ({
  user: one(users, { fields: [repositories.userId], references: [users.id] }),
  primaryLabel: one(labels, {
    fields: [repositories._primaryLabel],
    references: [labels.name],
  }),
  labels: many(repoLabels),
  languages: many(repoLangs),
}));
export type Repository = BaseRepositoryType & {
  user: User;
  primaryLabel: Label;
  labels: RepoLabelWLabel[];
  languages: RepoLangWLang[];
};

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
    pk: primaryKey(table.name, table.repoPK),
  }),
);
export type RepoLabel = InferModel<typeof repoLabels>;
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
export interface RepoLabelWLabel extends RepoLabel {
  label?: Label;
}

/* Languages automatically assigned to repositories on creation */
export const repoLangs = mysqlTable(
  "repoLangs",
  {
    name: varchar("name", { length: 128 }).notNull(),
    repoId: varchar("repoId", { length: 256 }).notNull(),
    repoType: mysqlEnum("type", ["github", "gitlab", "bitbucket"])
      .default("github")
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.name, table.repoId, table.repoType),
  }),
);
export type RepoLanguage = InferModel<typeof repoLangs>;
export const repoLangRelations = relations(repoLangs, ({ one }) => ({
  language: one(languages, {
    fields: [repoLangs.name],
    references: [languages.name],
  }),
  repository: one(repositories, {
    fields: [repoLangs.repoId, repoLangs.repoType],
    references: [repositories.id, repositories.type],
  }),
}));
export interface RepoLangWLang extends RepoLanguage {
  language?: Language;
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
export type Report = InferModel<typeof reports>;
export type ReportWithUser = Report & { user: User };

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
export type Log = InferModel<typeof logs>;
