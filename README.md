# DDR user evaluation

A public documentation framework for the DDR user evaluation, built with React, Vite, React Router and the IBM Carbon Design System. The documentation is placeholder material, not instructions for the underlying research applications.

## Setup and development

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite (including `/ddr-user-evaluation/`). Other commands:

```sh
npm test
npm run build
npm run preview
```

The theme toggle switches between Carbon g10 and g90 and remembers the selection in the browser. The initial theme follows the system preference when no selection has been saved.

## Styling

Use the Carbon 11 components, theme, spacing and typography tokens. Put component and page styles in SCSS partials under `src/styles/components/`, imported by `src/styles/main.scss`; keep shared resets and styles in the entry point. Do not use inline styles. Layout-specific constraints, such as reading widths, may use explicit dimensions where Carbon has no corresponding token.

## Authoring documentation

Documentation is Markdown in `src/content/`. The page and section registry in `src/content/navigation.js` supplies routes and the left-hand navigation. To add a page, create a Markdown file, import it with Vite's `?raw` suffix and add its label, route and content to the appropriate section. Use one level-one heading for the title; level-two headings automatically appear in the optional “On this page” navigation. Markdown blockquotes can be used for tips, notes and warnings.

The table of contents and reading pane scroll independently; on very short mobile screens the page scrolls normally so that both remain accessible. The search field filters pages across all three sections by section name, page title and Markdown text. Search runs locally in the browser; it does not send queries to a server. New pages added to the registry are included automatically.

Store approved screenshots in the relevant folder: `public/images/ddr-public/`, `public/images/ddr-admin/` or `public/images/research-instrument/`. Reference them using a root-relative image path, for example:

```md
![A descriptive alternative text](/images/ddr-public/example.png "A visible screenshot caption")
```

An image on its own line is displayed as a responsive figure. Its title is the caption; if omitted, the alternative text is used. Annotated screenshots can be stored in the same folder; explain annotations in the text as well as visually. Avoid relying on colour alone.

**This is a public site.** Do not add participant identities, evaluation responses, credentials or other confidential material to documentation, screenshots, source code or Git history. Check all content and images before publishing.

## Deployment

The Vite base path is `/ddr-user-evaluation/`. The workflow in `.github/workflows/deploy.yml` runs tests, builds and deploys to GitHub Pages on pushes to `main` and can also be started manually. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Push these changes to `main` and allow the workflow to complete. The site will be available at:

<https://munomono.github.io/ddr-user-evaluation/>

GitHub Pages serves `public/404.html` for direct requests to client-side routes. It redirects to the app, which restores the original path, query and fragment before React Router starts. Keep the base path in `vite.config.js`, `index.html` and `public/404.html` consistent if the repository path changes. The initial 404 response is expected on a direct Pages request.

The MIT licence in `LICENSE` is retained.
