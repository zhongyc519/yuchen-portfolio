# Yuchen Zhong Portfolio

Personal portfolio for strategy, concept development, creative work and AI experiments.

## Website

The front end is native HTML, CSS and JavaScript. The production build copies the public files to `dist/` and writes a public Sanity configuration file from environment variables.

```text
npm test
npm run build
npm run dev
```

## Selected Work CMS

Sanity Studio manages Selected Work only. The existing local project data remains the immediate, silent fallback if CMS configuration is absent, the network fails, or the published query returns no projects.

```text
npm run cms:seed
npm run studio:install
npm run studio:dev
npm run studio:build
```

The admin setup and daily publishing workflow are documented in [docs/CMS_GUIDE.md](docs/CMS_GUIDE.md). Copy `.env.example` to a local environment file when configuring the project; never commit credentials.
