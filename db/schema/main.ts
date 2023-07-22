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

/* Information about repository we'll store in our database */
export const repositories = mysqlTable(
  "repositories",
  {
    id: varchar("id", { length: 256 }).notNull(),
    type: mysqlEnum("type", ["github", "gitlab", "bitbucket"]).notNull(),
    author: varchar("author", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    stars: int("stars").default(0),
    maintainLink: text("maintainLink"),
    _primaryLabel: varchar("_primary_label", { length: 128 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(), // Suggester
    lastUpdated: timestamp("lastUpdated").onUpdateNow().notNull(),
  },
  (table) => ({
    pk: primaryKey(table.id, table.type),
  })
);
export const repositoryRelations = relations(repositories, ({ one, many }) => ({
  user: one(users, { fields: [repositories.userId], references: [users.id] }),
  primaryLabel: one(labels, {
    fields: [repositories._primaryLabel],
    references: [labels.name],
  }),
  labels: many(repoLabels),
  languages: many(repoLangs),
}));
export type Repository = InferModel<typeof repositories> & {
  user: User;
  primaryLabel: Label;
  labels: RepoLabels[];
  languages: RepoLanguage[];
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
    repoId: varchar("repoId", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(), // Suggester
  },
  (table) => ({
    pk: primaryKey(table.name, table.repoId),
    repoIdIndex: index("repoLabels__repoId__idx").on(table.repoId),
  })
);
export type RepoLabels = InferModel<typeof repoLabels>;
export const repoLabelRelations = relations(repoLabels, ({ one }) => ({
  user: one(users, { fields: [repoLabels.userId], references: [users.id] }),
  label: one(labels, {
    fields: [repoLabels.name],
    references: [labels.name],
  }),
  repository: one(repositories, {
    fields: [repoLabels.repoId],
    references: [repositories.id],
  }),
}));

/* Languages automatically assigned to repositories on creation */
export const repoLangs = mysqlTable(
  "repoLangs",
  {
    name: varchar("name", { length: 128 }).notNull(),
    repoId: varchar("repoId", { length: 256 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.name, table.repoId),
    repoIdIndex: index("repoLangs__repoId__idx").on(table.repoId),
  })
);
export type RepoLanguage = InferModel<typeof repoLangs>;
export const repoLangRelations = relations(repoLangs, ({ one }) => ({
  language: one(languages, {
    fields: [repoLangs.name],
    references: [languages.name],
  }),
  repository: one(repositories, {
    fields: [repoLangs.repoId],
    references: [repositories.id],
  }),
}));