# RepoSift

An updated version of a project I've made recently, [GitInspire](https://github.com/cyanChill/GitInspire). This will be made entirely in Next.js for a better user experience when hosting as currently, the backend of GitInspire has cold starts, which causes the user to have to wait a bit before the application is fully functional. In addition, I'm planning out the styling of the app in Figma compared to what I did prior. I opted to have my app follow a neubrutalism style, which has a bold and simple look.

## Setting Up The Database

Given we've populated our `.env` file, we need to generate the schema in SQL and push it to our PlanetScale database.

1. First, we create a migration file containing SQL queries to generate our tables from our schema by running `npx drizzle-kit generate:mysql`.

   - We rerun this command whenever we make changes to our schema.
   - This will be generated in a `/migrations-folder` in the root directory of our application (**this folder shouldn't exist the first time we run this command**).

2. Next, we want to push the migration to PlanetScale by running `npm run db:push`.

   - This runs `npx drizzle-kit push:mysql --config=drizzle.config.ts`.

> **Ref:** https://orm.drizzle.team/kit-docs/overview

## Visualizing Database In Browser

Drizzle provides the option to view and manipulate our database in the browser using [**Drizzle Studio**](https://orm.drizzle.team/drizzle-studio/overview).

- Just run `npm run db:studio` and open up the link in the console (ie: `http://127.0.0.1:4983`).
