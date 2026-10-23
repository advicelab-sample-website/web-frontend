# SEO prerendering guide

This project uses two SEO layers:

1. **Static build-time SEO** for the first HTML response. This is what search engines, social crawlers, and **View Page Source** receive before JavaScript runs.
2. **Client-side SEO** from `src/components/ui/Seo.tsx`. This keeps metadata correct when a visitor navigates between routes inside the React application and remains enabled.

The two layers should contain the same values. If they disagree, View Page Source and Inspect Element will show different metadata.

## How the build works

The normal production build is defined in `package.json`:

```text
npm run build
```

It performs these steps:

1. Vite creates the application bundle in `dist/`.
2. `scripts/prerender-seo.mjs` reads the built `dist/index.html` shell.
3. The script replaces the section between `SEO_MANAGED_START` and `SEO_MANAGED_END` with route-specific metadata.
4. It writes an HTML file for every route in its `routes` array.

For example, the build creates:

```text
dist/index.html                         # /
dist/about-us/index.html               # /about-us
dist/about-us.html                     # clean static fallback
dist/services/index.html                # /services
dist/services/paraplanning/index.html  # /services/paraplanning
```

Each generated file contains its own:

- `<title>`
- description and keywords
- canonical URL
- Open Graph title, description, URL, and image
- Twitter title, description, and image
- hreflang links
- Organization, WebSite, and BreadcrumbList JSON-LD

`vercel.json` must not rewrite every request to `/`. That would make every route return the homepage HTML and would make View Page Source show the default metadata again.

## Adding a new static page

When adding a page such as `/services/wealth-planning`, update all of these locations.

### 1. Add the React route

Update `src/App.tsx`:

```tsx
const WealthPlanning = lazy(() => import("./pages/services/WealthPlanning"));

<Route path="/services/wealth-planning" element={<WealthPlanning />} />;
```

Use the exact public URL that should appear in search results.

### 2. Add the React SEO component

Inside the new page, keep using the existing `Seo` component:

```tsx
<Seo
  title="Wealth Planning Support | Advice Lab"
  description="Support for Australian financial advisers with wealth planning administration and research."
  keywords="wealth planning support, financial adviser support"
  pathname="/services/wealth-planning"
/>
```

The `pathname` must match the route path exactly. Do not add a trailing slash unless the site deliberately uses trailing slashes.

### 3. Add the same metadata to the prerender route list

Update `scripts/prerender-seo.mjs` and add an object to the `routes` array:

```js
{
  path: "/services/wealth-planning",
  title: "Wealth Planning Support | Advice Lab",
  description:
    "Support for Australian financial advisers with wealth planning administration and research.",
  keywords: "wealth planning support, financial adviser support",
},
```

The following values must match the page's `Seo` component:

| Static route entry | React `Seo` prop |
| ------------------ | ---------------- |
| `path`             | `pathname`       |
| `title`            | `title`          |
| `description`      | `description`    |
| `keywords`         | `keywords`       |

Do not put a new page's title into `index.html` as a permanent default. The prerender script is responsible for replacing the managed head for each route.

### 4. Add page-specific structured data only where needed

If the React page passes `schemaData` to `Seo`, add the same schema to the prerender script's route definition and `createSeoHead()` logic. Otherwise, the static HTML will contain the generic Organization, WebSite, and BreadcrumbList schemas but not the page-specific schema.

For example, a LocalBusiness, Service, Article, or JobPosting schema should use the same canonical URL as the page. Never use `/about` when the actual route is `/about-us`.

### 5. Build and inspect the generated file

Run:

```powershell
cd d:\advice-lab-web
npm run build
```

Then confirm the output exists:

```text
dist/services/wealth-planning/index.html
dist/services/wealth-planning.html
```

Search the generated file for the expected title and canonical URL before deploying.

## Dynamic routes

A route with a variable value cannot use one generic static metadata record. Examples include:

- `/blog/:slug`
- `/careers/job/:jobId`

For a dynamic page, use one of these approaches:

### Known, finite dynamic pages

If the slugs or job IDs are known at build time, add one route object per URL to `routes`, with its exact title, description, and canonical URL. The build will then create a separate HTML file for each item.

### Data that changes at runtime

If blog posts or jobs are fetched from an API and can change without a deployment, this Vite static approach cannot generate accurate View Page Source metadata for every new item. Use server-side rendering, an edge/server function, or a CMS/static export step that fetches the data during the deployment build.

The existing React `Seo` component should still remain in the dynamic page so client-side navigation continues to update metadata.

## Testing correctly

### Local production preview

Use the Vite CLI directly to avoid npm argument forwarding differences:

```powershell
cd d:\advice-lab-web
npm run build
npx vite preview --host 127.0.0.1
```

Open a route such as:

```text
http://127.0.0.1:4173/about-us
http://127.0.0.1:4173/services
```

Use **View Page Source**, not only Inspect Element. The source should contain the route's title, description, `og:url`, and canonical URL before JavaScript runs. Inspect Element should show the same values after React loads.

Also test a direct hard refresh of the route. Do not test only by clicking from the homepage, because client-side navigation exercises the React SEO layer but not necessarily the server's initial HTML response.

### Compare two routes

For `/about-us`, expect values similar to:

```html
<title>About Advice Lab - Trusted Offshore Paraplanning Partner</title>
<link rel="canonical" href="https://advicelab.com.au/about-us" />
<meta property="og:url" content="https://advicelab.com.au/about-us" />
```

For `/services`, expect a different title and URL:

```html
<title>
  Financial Services for Advisers | Paraplanning, Client Support, SMSF &amp;
  Mortgage
</title>
<link rel="canonical" href="https://advicelab.com.au/services" />
<meta property="og:url" content="https://advicelab.com.au/services" />
```

### Deployment check

After deployment, test the real URL in a private window and use **View Page Source**. If it still shows the homepage metadata, check these items:

1. The route exists in `scripts/prerender-seo.mjs`.
2. `npm run build` completed successfully.
3. The corresponding route HTML exists in `dist/` and was uploaded.
4. `vercel.json` does not contain a catch-all rewrite to `/`.
5. The CDN or hosting cache was invalidated, if applicable.

## SEO consistency checklist

For every new indexable page:

- Add the route to `src/App.tsx`.
- Add the existing React `Seo` component to the page.
- Use a unique title and description.
- Use the exact route in `pathname`.
- Add the same route and values to `scripts/prerender-seo.mjs`.
- Keep canonical and Open Graph URLs on the same official domain.
- Check structured-data URLs for typos or old routes.
- Run `npm run build`.
- Check the generated route HTML.
- Test both View Page Source and Inspect Element.
- Test a direct URL refresh in production.

The React SEO component does not need to be removed or replaced. The important maintenance rule is to keep its page metadata and the prerender route entry synchronized.
