import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const sourceHtml = path.join(distDir, "index.html");
const sitemapPath = path.join(projectRoot, "public", "sitemap_index.xml");

const site = {
  name: "Advice Lab",
  url: "https://advicelab.com.au",
  image: "https://advicelab.com.au/og-image.webp",
  twitter: "@advicelab",
  author: "Advice Lab",
  defaultTitle:
    "Advice Lab | Comprehensive Offshore Support for Australian Financial Advisers",
  defaultDescription:
    "Offshore paraplanning, client support & compliance services for Australian financial advisers—scale your practice with reliable, qualified teams.",
  defaultKeywords:
    "paraplanning services, financial advice support, offshore paraplanning, financial adviser outsourcing, compliance support, client service support",
};

const routes = [
  {
    path: "/",
    title: site.defaultTitle,
    description: site.defaultDescription,
    keywords: site.defaultKeywords,
  },
  {
    path: "/about-us",
    title: "About Advice Lab - Trusted Offshore Paraplanning Partner",
    description:
      "Discover Advice Lab's mission to support Australian financial advisers with expert paraplanning, client service, and compliance solutions. Meet our experienced team.",
    keywords:
      "about Advice Lab, paraplanning company, financial services outsourcing, offshore financial support, financial adviser partner, paraplanning team, Australian financial services, reliable financial support",
  },
  {
    path: "/services",
    title:
      "Financial Services for Advisers | Paraplanning, Client Support, SMSF & Mortgage",
    description:
      "Comprehensive offshore services for Australian financial advisers: paraplanning, client support officers, SMSF & accounting, and mortgage support. Scale your practice efficiently with expert support.",
  },
  {
    path: "/services/paraplanning",
    title: "Expert Paraplanning Services for Financial Advisers",
    description:
      "Professional paraplanning support: SOA preparation, client file management, compliance documentation & portfolio reviews. Scale your practice with our experts.",
  },
  {
    path: "/services/clientsupport",
    title: "Client Support & Administrative Support",
    description:
      "Professional client support officers for financial advisers. Bookkeeping, reporting, BAS preparation, payroll & reconciliations. Streamline your operations.",
  },
  {
    path: "/services/mortgage-support",
    title: "Mortgage Support Services | Advice Lab",
    description:
      "Expert mortgage broking support for financial advisers and brokers. Loan application preparation, broker admin, compliance support, lender communication and settlement coordination.",
  },
  {
    path: "/services/smsf-accounting",
    title: "SMSF & Accounting Support | Advice Lab",
    description:
      "Expert SMSF administration and accounting support for financial advisers and accountants. Tax returns, BAS preparation, financial statements, audit coordination and more.",
  },
  {
    path: "/services/paraplanning-pricing",
    title: "Pricing Calculator - Advice Lab",
    description:
      "Transparent pricing for Statements or Records of Advice—select strategies and see live costs. Fast-track options and strategy-based fees.",
  },
  {
    path: "/services/paraplanning-quote",
    title: "Pricing Calculator - Advice Lab",
    description:
      "Transparent pricing for Statements or Records of Advice—select strategies and see live costs. Fast-track options and strategy-based fees.",
  },
  {
    path: "/resources/pricing-calculator",
    title: "Pricing Calculator - Advice Lab",
    description:
      "Transparent pricing for Statements or Records of Advice—select strategies and see live costs. Fast-track options and strategy-based fees.",
  },
  {
    path: "/resources/blogs",
    title: "Blog",
    description:
      "Guides, tools and insights to help advisers get the most from offshore support.",
  },
  {
    path: "/careers",
    title: "Join Our Team - Careers & Job Opportunities",
    description:
      "Exciting career opportunities at Advice Lab. Join our growing team of paraplanning & financial services professionals. Check current vacancies in Australia & Asia.",
  },
  {
    path: "/careers/philippines",
    title:
      "Job Opportunities in Philippines | Paraplanning Careers | Advice Lab",
    description:
      "Explore career opportunities in the Philippines with Advice Lab. Join our dynamic team supporting Australian financial advisers.",
    keywords:
      "Philippines jobs, paraplanning jobs Philippines, financial services jobs Manila, Advice Lab careers",
  },
  {
    path: "/careers/srilanka",
    title: "Career Opportunities in Sri Lanka | Advice Lab",
    description:
      "Discover career opportunities in Sri Lanka with Advice Lab. Join our team providing paraplanning and financial support services.",
    keywords:
      "Sri Lanka jobs, paraplanning jobs, financial services careers, Colombo jobs, Advice Lab careers",
  },
  {
    path: "/careers/submit-resume",
    title: "Submit Your Resume | Advice Lab Careers",
    description:
      "Submit your resume to Advice Lab for future paraplanning, client support, and financial services opportunities across Australia and Asia.",
  },
  {
    path: "/giving-back",
    title: "Giving Back with Advice Lab: Stories of Purpose, People & Impact",
    description:
      "Discover how Advice Lab gives back — through flood relief, animal rescue, reforestation, and education initiatives across Sri Lanka and the Philippines.",
  },
  {
    path: "/contact-us",
    title: "Contact Us",
    description:
      "Get in touch with Advice Lab. Phone, email, or contact form. We're based in Sydney and serve Australian financial advisers. Response within 24 hours.",
  },
  {
    path: "/cookies-policy",
    title: "Cookies Policy - Advice Lab",
    description:
      "Learn about how Advice Lab uses cookies and similar technologies to improve your browsing experience and understand your preferences.",
  },
  {
    path: "/information-security-statement",
    title: "ISMS Statement - Advice Lab",
    description:
      "Learn about how Advice Lab protects the confidentiality, integrity, and availability of information through its ISO/IEC 27001:2022 aligned Information Security Management System.",
  },
  {
    path: "/404",
    title: "Page Not Found | Advice Lab",
    description:
      "The page you're looking for could not be found. Return to Advice Lab's homepage or explore our services, resources, and careers.",
    keywords: "Advice Lab, page not found, 404",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function getRouteUrl(route) {
  return (
    route.canonicalUrl ||
    `${site.url}${route.path === "/" ? "/" : route.path}`
  );
}

function getHreflang(route) {
  if (route.path.includes("/philippines")) return "en-PH";
  if (route.path.includes("/srilanka")) return "en-LK";
  return "en-AU";
}

function createSeoHead(route) {
  const fullTitle = route.title || site.defaultTitle;
  const description = route.description || site.defaultDescription;
  const keywords = route.keywords || site.defaultKeywords;
  const url = getRouteUrl(route);
  const pageName = fullTitle.replace(` | ${site.name}`, "");
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: site.url,
        logo: site.image,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        url: site.url,
        name: site.name,
        description: site.defaultDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.url}/?s={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${site.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: pageName,
            item: url,
          },
        ],
      },
    ],
  };

  return `
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${site.author}" />
    <meta name="robots" content="index,follow" />
    <meta name="language" content="English" />
    <meta name="revisit-after" content="7 days" />
    <meta name="copyright" content="Advice Lab © 2026" />

    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${site.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${site.twitter}" />
    <meta name="twitter:creator" content="${site.twitter}" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${site.image}" />

    <link rel="canonical" href="${escapeHtml(url)}" />
    <link rel="alternate" hreflang="${getHreflang(route)}" href="${escapeHtml(url)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(
      `${site.url}/`,
    )}" />

    <script id="ld-json-seo" type="application/ld+json">${escapeJsonForHtml(graph)}</script>
`;
}

const html = await fs.readFile(sourceHtml, "utf8");
const markerPattern =
  /<!-- SEO_MANAGED_START -->[\s\S]*?<!-- SEO_MANAGED_END -->/;

const jobVacancies = JSON.parse(
  await fs.readFile(
    path.join(projectRoot, "src", "data", "jobVacancies.json"),
    "utf8",
  ),
);

const sitemap = await fs.readFile(sitemapPath, "utf8");
const blogRoutes = [];
const blogPaths = new Set();

for (const [, sitemapEntry] of sitemap.matchAll(
  /<loc>\s*([^<]+?)\s*<\/loc>/g,
)) {
  const canonicalUrl = sitemapEntry.replaceAll("&amp;", "&").trim();
  const sitemapUrl = new URL(canonicalUrl);
  if (sitemapUrl.origin !== site.url) continue;

  const match = sitemapUrl.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) continue;

  const blogPath = sitemapUrl.pathname.replace(/\/$/, "");
  if (blogPaths.has(blogPath)) continue;
  blogPaths.add(blogPath);

  const blogTitle = decodeURIComponent(match[1])
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  blogRoutes.push({
    path: blogPath,
    canonicalUrl,
    title: `${blogTitle} | ${site.name}`,
    description: `Explore ${blogTitle} — practical insights and guidance for Australian financial advisers from Advice Lab.`,
  });
}

if (blogRoutes.length === 0) {
  throw new Error(`No blog URLs were found in ${sitemapPath}`);
}

routes.push(...blogRoutes);

for (const job of jobVacancies.filter((vacancy) => vacancy.isActive)) {
  routes.push({
    path: `/careers/job/${job.id}`,
    title: `${job.title} - Careers at Advice Lab`,
    description: `${job.title} opportunity in ${job.location} at Advice Lab. Join our team supporting Australian financial advisers.`,
    keywords: `${job.title}, ${job.location} jobs, Advice Lab careers, financial services careers`,
  });
}

if (!markerPattern.test(html)) {
  throw new Error("SEO markers were not found in dist/index.html");
}

for (const route of routes) {
  const routeHtml = html.replace(
    markerPattern,
    `<!-- SEO_MANAGED_START -->${createSeoHead(route)}    <!-- SEO_MANAGED_END -->`,
  );
  const outputDir = path.join(
    distDir,
    route.path === "/" ? "" : route.path.slice(1),
  );
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "index.html"), routeHtml);
  if (route.path !== "/") {
    await fs.writeFile(
      path.join(distDir, `${route.path.slice(1)}.html`),
      routeHtml,
    );
  }
}

const notFoundRoute = {
  path: "/404",
  title: "Page Not Found | Advice Lab",
  description:
    "The page you're looking for could not be found. Return to Advice Lab's homepage or explore our services, resources, and careers.",
  keywords: "Advice Lab, page not found, 404",
};

const notFoundHtml = html.replace(
  markerPattern,
  `<!-- SEO_MANAGED_START -->${createSeoHead(notFoundRoute)}    <!-- SEO_MANAGED_END -->`,
);

await fs.writeFile(path.join(distDir, "404.html"), notFoundHtml);

console.log(`Generated SEO HTML for ${routes.length} routes.`);
