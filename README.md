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

Each application has three groups: **User Guide**, **Evaluation Tasks** and **Evaluation Information**. Their existing pages and three illustrative DDR Public examples are placeholders, not approved procedures or evaluation materials.

To create a page:

1. Add a Markdown file under the appropriate application in `src/content/`. Use British English, one level-one heading for its title and level-two headings for its sections. These headings automatically populate “On this page”.
2. Import the file with Vite's `?raw` suffix in `src/content/navigation.js`, then add its `label`, `path` and `content` to the appropriate group's `pages` array. The order of pages in that array controls navigation and previous/next links. The first User Guide page should retain the application's existing root path.
3. Use a root-relative route for an internal Markdown link, for example `[Introduction](/ddr-public)`, and an `https://` URL for an external link. Check links in the local preview.
4. Run `npm run dev`, review the page in both themes and on a small screen, then run `npm test` and `npm run build`.

For a procedure, use the relevant parts of the example “Finding a record in the archive”: introduction, what the reader will learn, prerequisites, numbered steps, screenshots, expected result and troubleshooting. Omit headings that are not useful. Use Markdown blockquotes for tips, notes and warnings.

For an evaluation task, register it in **Evaluation Tasks**. State the task identifier, context, objective, activity and appropriate prerequisites without teaching the actions or answers under investigation. Review any links and previous/next ordering for methodological impact. Previous/next links stay within the same content group. For participant-facing arrangements, add a page to **Evaluation Information** only after its wording has been reviewed.

The table of contents and reading pane scroll independently; on very short mobile screens the page scrolls normally. Search is local to the browser and searches application and group names, page titles and Markdown text. Registered pages are included automatically.

### Screenshots and annotations

Store approved images in `public/images/ddr-public/`, `public/images/ddr-admin/` or `public/images/research-instrument/`. Use descriptive, consistent filenames. Add a screenshot on its own line, close to the step it illustrates:

```md
![Describe what the screenshot shows](/images/ddr-public/example.png "A visible caption")
```

Alternative text is required; describe the image rather than repeating “screenshot”. The optional title becomes the caption; otherwise the alternative text is used. Figures are numbered automatically in page order. Readers can select an image to enlarge it, scroll the enlarged image, and close it with Escape or the close button.

Until an approved image is available, insert a clearly marked placeholder using a fenced block. It is numbered alongside real figures:

````md
```screenshot-placeholder
Describe the intended screenshot and its caption here.
```
````

To annotate a screenshot, add its root-relative image path and marker data to `src/content/screenshot-annotations.js`. This keeps the original image unchanged. For example, an entry inside the exported object could be:

```js
'/images/ddr-public/example.png': [
  { number: 1, x: 25, y: 40, label: 'Description of the relevant control' },
]
```

Coordinates are whole percentages from the image's left and top edges, from 0 to 100. Numbers must be unique positive integers and labels must be meaningful. Markers appear on both image views, with a matching text list; refer to the same numbers in the procedure and check placement at small sizes. Invalid annotation entries and missing image alternative text are reported as errors.

### Metadata and evaluation snapshots

Each navigation entry may include an optional `metadata` object with `id`, `applicationVersion`, `documentationVersion` and `lastReviewed` fields. The application and content type come from the navigation group. Add only known, reviewed values, for example:

```js
metadata: { id: 'approved-page-id', documentationVersion: 'approved-version', lastReviewed: 'YYYY-MM-DD' }
```

The values above illustrate the format, not actual research metadata. Git commits and tags are the initial version record. After reviewing and committing the exact documentation for an evaluation round, create an annotated tag and push it, substituting an agreed non-sensitive tag name and description:

```sh
git tag -a evaluation-round-name -m "Documentation snapshot for evaluation round"
git push origin evaluation-round-name
```

The tag preserves the source revision; it does not freeze the live Pages site, which continues to deploy from `main`. Record the tag and any verified application versions in the appropriate non-public research records.

**This is a public site.** Do not publish participant identities, contact details, interview transcripts, evaluation responses, personal consent forms, credentials, restricted archival material or private notes unless publication has been explicitly authorised. Check all text and images before publishing. The site does not collect responses or implement analytics or tracking.

## Deployment

The Vite base path is `/ddr-user-evaluation/`. The workflow in `.github/workflows/deploy.yml` runs tests, builds and deploys to GitHub Pages on pushes to `main` and can also be started manually. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Push these changes to `main` and allow the workflow to complete. The site will be available at:

<https://munomono.github.io/ddr-user-evaluation/>

GitHub Pages serves `public/404.html` for direct requests to client-side routes. It redirects to the app, which restores the original path, query and fragment before React Router starts. Keep the base path in `vite.config.js`, `index.html` and `public/404.html` consistent if the repository path changes. The initial 404 response is expected on a direct Pages request.

The MIT licence in `LICENSE` is retained.
