<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/cyanChill/RepoSift">
    <img src="/public/assets/icons/logo-full.svg" alt="Logo" width="192" height="50">
  </a>

  <h3 align="center">RepoSift</h3>

  <p align="center">
    Better repository indexing and searching.
    <br />
    <a href="https://github.com/cyanChill/RepoSift"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://repo-sift.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/cyanChill/RepoSift/issues">Report Bug</a>
    ·
    <a href="https://github.com/cyanChill/RepoSift/issues">Request Feature</a>
  </p>
</div>





<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About the Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>





<!-- ABOUT THE PROJECT -->

## About the Project

RepoSift is an updated version of [GitInspire](https://github.com/cyanChill/GitInspire), aimed to allow for more expandability (ie: Adding support for GitLab and Bitbucket, instead of staying with just GitHub). In addition, this has been rewritten to take more advantage of the features of Next.js.

> Previously, we had our backend written in Python using Flask. The problem was with the cold starts and constant need to migrate the database due to using Render's free PostgreSQL database, which only lasts for 90 days.

A short summary of what RepoSift aims to provide is giving developers a platform to come up with ideas more easily through:

1. A simple interface to search for random repositories through a simple filter through supported providers (for now, only GitHub).
2. A database of indexed repositories which the community can contribute to expand.

### Built With

[![Next][Next.js]][Next.js-url]
[![NextAuth.js][NextAuth.js]][NextAuth.js-url]
[![TypeScript][TypeScript]][TypeScript-url]
[![Tailwind CSS][Tailwind]][Tailwind-url]
[![Headless UI][Headless UI]][Headless UI-url]
[![Vercel][Vercel]][Vercel-url]
[![PlanetScale][PlanetScale]][PlanetScale-url]
[![MySQL][MySQL]][MySQL-url]
[![DrizzleORM][DrizzleORM]][DrizzleORM-url]

### Demo

https://github.com/cyanChill/RepoSift/assets/83375816/7e65132c-d9c8-4351-8e61-d6aa293ba389

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

For this project, you're required to have `pnpm` installed. You can following the guide at `pnpm`: https://pnpm.io/installation.

### Installation

1. Create a free GitHub OAuth App at [https://github.com/settings/developers](https://github.com/settings/developers)
2. Clone the repo
   ```sh
   git clone https://github.com/cyanChill/RepoSift.git
   ```
3. Then install the dependencies by running `pnpm i`.
4. Create an `.env` file, populated with the values specified in the [`.env.example`](.env.example) file.

### Setting Up the Database

For this application, I've used PlanetScale as my database provider of choice. [Click this](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide) for a brief guide on creating a database with PlanetScale. Once we created a database in PlanetScale, we want to push the schema defined in this repository to your database by running `pnpm db:push`.

- This runs `npx drizzle-kit push:mysql --config=drizzle.config.ts`.

> **Ref:** https://orm.drizzle.team/kit-docs/overview

#### Extras

If we want to make any changes to the schema defined in the repository, you can validate the SQL commands needed to update the schema by running `pnpm db:generate`. This provides us with the SQL queries that reflect the changes made to the database.

- This runs `npx drizzle-kit generate:mysql`.
- We rerun this command whenever we make changes to our schema.
- This will be generated in a `/migrations-folder` in the root directory of our application (**this folder shouldn't exist the first time we run this command**).

### Visualizing the Database in Browser

Drizzle provides the option to view and manipulate our database in the browser using [**Drizzle Studio**](https://orm.drizzle.team/drizzle-studio/overview).

- Just run `pnpm db:studio` and open up the link in the console (ie: `http://127.0.0.1:4983`).

### Running the Front End

To run the front-end code (in development mode), run `pnpm dev` while in the `client` directory.

- For production, you need to build the code using `pnpm build` and then do `pnpm start` to run off that build.
- A suggestion for hosting this front-end application is [Vercel](https://vercel.com/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- FEATURES -->

## Features

### Discover

Visitors of RepoSift can view a list of indexed & labeled repositories suggested by users of our applications to help other developers.

- Users can search through our database of indexed repositories using **repository providers**, **languages**, **labels**, and **stars**.

**Alternatively**, developers can utilize **simple search**, which can search through repositories directly from providers like GitHub, however, with a more limited filter.

> A great benefit of our labeling system is that a developer can label a repository as `Abandoned` to bring more awareness to it and hope for other developers to pick it up or suggest alternatives.

### Contribute

With the core of our application being developers helping other developers by suggesting repositories to our database and labeling them accordingly, we allow:

- GitHub accounts with an age **`>3 months`** to index repositories to grow our database to help others.
- GitHub accounts with an age **`>1 year`** to create labels to help better refine the search process by giving more options on how a repository can be identified.

### GitHub Login

As an application aimed around repository providers, we allow users to sign in with those accounts. Currently, the only provider supported is GitHub, with GitLab & Bitbucket planned in the future.

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[license-shield]: https://img.shields.io/github/license/cyanchill/reposift
[license-url]: https://github.com/cyanChill/RepoSift/blob/main/license.md
[DrizzleORM]: https://img.shields.io/badge/drizzle_orm-000000?style=for-the-badge&logo=data:image/png;base64,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
[DrizzleORM-url]: https://orm.drizzle.team/
[Headless UI]: https://img.shields.io/badge/headless_ui-222222?style=for-the-badge&logo=Headless+UI&logoColor=66E3FF
[Headless UI-url]: https://headlessui.com/
[MySQL]: https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=MySQL&logoColor=FFFFFF
[MySQL-url]: https://www.mysql.com/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=FFFFFF
[Next.js-url]: https://nextjs.org/
[NextAuth.js]: https://img.shields.io/badge/nextauth.js-000000?style=for-the-badge&logo=data:image/png;base64,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
[NextAuth.js-url]: https://next-auth.js.org/
[PlanetScale]: https://img.shields.io/badge/planetscale-000000?style=for-the-badge&logo=PlanetScale&logoColor=FFFFFF
[PlanetScale-url]: https://planetscale.com/
[Tailwind]: https://img.shields.io/badge/tailwind_css-222222?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4
[Tailwind-url]: https://tailwindcss.com/
[TypeScript]: https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFFFFF
[TypeScript-url]: https://www.typescriptlang.org/
[Vercel]: https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=FFFFFF
[Vercel-url]: https://vercel.com/
