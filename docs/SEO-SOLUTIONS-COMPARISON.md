# SEO Solutions: SSR versus Vite route prerendering

## Short answer

This project currently uses **Solution B**:

> Keep React + Vite, then pre-render the known routes during the production build.

It does **not** currently use Solution A SSR.

The implementation is build-time static prerendering, not request-time server-side rendering. The existing React application, routing, and `Seo` component remain in place.

## Solution A: Pre-render / SSR

Solution A means that a server renders the React application into HTML before returning a request.

Typical request flow:

```text
Browser requests /about-us
        |
        v
SSR server receives the request
        |
        v
React renders the About page on the server
        |
        v
Server returns About HTML and About SEO metadata
        |
        v
React hydrates in the browser
```

The server knows the requested URL at request time. It can therefore generate metadata for:

- `/about-us`
- `/services`
- `/blog/some-post`
- `/careers/job/some-job-id`
- Any other route generated from current API or database data

### Advantages of Solution A

- Metadata is generated dynamically for every request.
- New blog posts and jobs can have unique source HTML without rebuilding the whole site.
- The server can fetch current content before rendering.
- One React component tree can be the source of both page content and metadata.
- It is suitable for large sites with many dynamic routes.

### Costs and requirements of Solution A

- The application needs an SSR-capable framework or server entry point.
- Hosting must run a Node/serverless/edge server instead of serving only static files.
- React routing and data loading may need SSR-compatible changes.
- Browser-only code must be guarded because it can run on the server.
- Deployment, caching, and server execution become more complex.
- It is a larger architectural change for the current Vite SPA.

Examples of technologies commonly used for Solution A include Next.js, Remix, or a custom React SSR server. Adding an SEO plugin alone would not turn the current SPA into SSR.

## Solution B: React + Vite build-time prerendering

Solution B keeps the current Vite SPA and creates static HTML files for known routes during the build.

Current request/build flow:

```text
npm run build
        |
        v
Vite creates dist/index.html and the JavaScript bundle
        |
        v
scripts/prerender-seo.mjs reads dist/index.html
        |
        v
The script creates route-specific HTML files
        |
        v
The host serves the matching static HTML file
        |
        v
React loads and keeps client-side routing and Seo updates working
```

For example, the build generates files similar to:

```text
dist/index.html
                 # /
dist/about-us/index.html
                 # /about-us
dist/services/index.html
                 # /services
dist/services/paraplanning/index.html
                 # /services/paraplanning
```

The script also creates extensionless fallback files such as:

```text
dist/about-us.html
dist/services.html
```

Each generated page receives its own initial:

- `<title>`
- Description
- Keywords
- Canonical URL
- Open Graph metadata
- Twitter metadata
- Hreflang links
- JSON-LD structured data

### Advantages of Solution B

- Small change to the existing React + Vite application.
- No SSR server is required.
- Static hosting and CDN deployment remain possible.
- Fast initial HTML responses.
- Existing React routing and client-side `Seo` logic remain available.
- Appropriate for the current finite set of marketing and information pages.

### Limitations of Solution B

- Every pre-rendered route must be listed in `scripts/prerender-seo.mjs`.
- A new route needs a new production build and deployment.
- Runtime-created URLs cannot have unique static SEO unless they are known at build time.
- API-driven blog posts and job pages need a build-time data export or SSR if unique source metadata is required.
- The hosting server must serve the generated route file instead of rewriting every route to the homepage.

## What was implemented in this project

The following files form the current Solution B implementation:

### `package.json`

The production build runs:

```json
"build": "vite build && node scripts/prerender-seo.mjs"
```

Vite builds first. The prerender script runs only after the Vite build succeeds.

### `index.html`

The existing head contains markers:

```html
<!-- SEO_MANAGED_START -->
...
<!-- SEO_MANAGED_END -->
```

The prerender script replaces only this marked section for each route. The rest of the application shell, analytics, icons, and scripts are preserved.

### `scripts/prerender-seo.mjs`

This is the route manifest and static metadata generator. Its `routes` array contains the known routes and their SEO values.

It reads the built HTML shell and writes a separate HTML file for every route. It does not render React components on the server. It only generates the initial HTML head.

### `src/components/ui/Seo.tsx`

This component remains active. After React loads or the user navigates inside the SPA, it updates `document.title`, meta tags, canonical URLs, hreflang links, and JSON-LD.

This gives the application two synchronized layers:

```text
Static prerendered head  -> View Page Source and crawlers
React Seo component      -> Inspect Element after hydration and SPA navigation
```

### `vercel.json`

There must not be a catch-all rewrite such as:

```json
{
  "source": "/(.*)",
  "destination": "/"
}
```

That rule makes every request return the homepage source and defeats route-specific prerendering. The current configuration keeps the route files available to the host.

## Which solution should this project use?

For the current site, Solution B is the smaller and safer choice because:

- The site already uses Vite and React Router.
- Most SEO routes are known static pages.
- Existing page components already contain `Seo` metadata.
- The site can continue using static hosting/CDN deployment.
- A full SSR migration would affect routing, data loading, deployment, and browser-only code.

Solution A becomes the better choice when the site requires many SEO-indexable pages whose content changes outside deployments, such as thousands of blog posts, product pages, or job listings.

## Adding a page with Solution B

For a new static page, update three areas:

### 1. Add the route in `src/App.tsx`

```tsx
const WealthPlanning = lazy(() => import("./pages/services/WealthPlanning"));

<Route path="/services/wealth-planning" element={<WealthPlanning />} />;
```

### 2. Add React SEO metadata in the page

```tsx
<Seo
  title="Wealth Planning Support | Advice Lab"
  description="Support for Australian financial advisers with wealth planning administration and research."
  keywords="wealth planning support, financial adviser support"
  pathname="/services/wealth-planning"
/>
```

### 3. Add the same route to `scripts/prerender-seo.mjs`

```js
{
  path: "/services/wealth-planning",
  title: "Wealth Planning Support | Advice Lab",
  description:
    "Support for Australian financial advisers with wealth planning administration and research.",
  keywords: "wealth planning support, financial adviser support",
},
```

These values must agree:

| Prerender field | React field   |
| --------------- | ------------- |
| `path`          | `pathname`    |
| `title`         | `title`       |
| `description`   | `description` |
| `keywords`      | `keywords`    |

Then build and deploy:

```powershell
cd d:\advice-lab-web
npm run build
```

## Dynamic pages and the boundary between the solutions

For a route such as `/blog/:slug`, Solution B works only when the list of slugs and their SEO data is available during the build.

A build-time generator could fetch the blog API and generate:

```text
dist/blog/first-post/index.html
dist/blog/second-post/index.html
```

If a new post can appear at any time without a deployment, static prerendering cannot create its source HTML automatically. That situation requires either:

- a deployment-time content export and rebuild, or
- Solution A SSR/server rendering.

The existing React `Seo` component should still be retained in either case for client-side navigation and browser updates.

## Testing the current Solution B

Run:

```powershell
cd d:\advice-lab-web
npm run build
npx vite preview --host 127.0.0.1
```

Open a direct route, for example:

```text
http://127.0.0.1:4173/about-us
http://127.0.0.1:4173/services
```

Use **View Page Source**. It should show different initial titles and canonical URLs for the two routes. Then use Inspect Element after React loads; it should show the same values.

If View Page Source always shows the homepage metadata, check:

1. The route exists in `scripts/prerender-seo.mjs`.
2. `npm run build` completed successfully.
3. The expected route HTML exists in `dist/`.
4. The host is serving the route HTML instead of rewriting to `/`.
5. Browser/CDN cache has been cleared or invalidated.

## Final classification

| Question                                                        | Current project                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Is this full SSR?                                               | No                                                                     |
| Is React still used?                                            | Yes                                                                    |
| Is Vite still used?                                             | Yes                                                                    |
| Is the existing `Seo` component retained?                       | Yes                                                                    |
| Are known routes pre-rendered at build time?                    | Yes                                                                    |
| Does each generated route have initial SEO HTML?                | Yes, when the build and hosting serve the route file                   |
| Can new static routes be added?                                 | Yes, by updating the React route, page `Seo`, and prerender route list |
| Are arbitrary runtime blog/job URLs automatically pre-rendered? | No, not without a build-time data step or SSR                          |
