import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/ui/Seo";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { useBloggerPost } from "@/hooks/useBloggerPost";

const stripInlineTypography = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.querySelectorAll<HTMLElement>("[style]").forEach((element) => {
    const block = element.closest<HTMLElement>(
      "h1, h2, h3, h4, h5, h6, p, li",
    );
    const tagName = block?.tagName.toLowerCase();
    const expectedFont = tagName?.startsWith("h")
      ? "Plus Jakarta Sans"
      : "DM Sans";
    const fontFamily = element.style.fontFamily;
    if (fontFamily && !fontFamily.includes(expectedFont)) {
      element.style.removeProperty("font-family");
    }

    const expectedSizes: Record<string, string[]> = {
      h1: ["1.875rem", "2.25rem"],
      h2: ["1.5rem"],
      h3: ["1.25rem"],
      h4: ["1.125rem", "1.25rem"],
      h5: ["1rem"],
      h6: ["1rem"],
      p: ["1rem"],
      li: ["1rem"],
    };
    
    const fontSize = element.style.fontSize.toLowerCase();
    if (
      fontSize &&
      !expectedSizes[tagName || "p"]?.includes(fontSize)
    ) {
      element.style.removeProperty("font-size");
    }

    const lineHeight = element.style.lineHeight.toLowerCase();
    const expectedLineHeights =
      tagName === "p"
        ? ["1.85", "29.6px"]
        : tagName === "li"
          ? ["normal"]
          : ["normal", "1.111", "1.333", "1.5", "1.6"];
    if (lineHeight && !expectedLineHeights.includes(lineHeight)) {
      element.style.removeProperty("line-height");
    }

    if (!element.getAttribute("style")?.trim()) {
      element.removeAttribute("style");
    }
  });

  return template.innerHTML;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBloggerPost(slug);
  const fallbackTitle =
    slug
      ?.split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Advice Lab Blog";
  const postTitle = post?.title?.trim() || fallbackTitle;
  const postDescription =
    post?.excerpt?.trim() ||
    `Read ${postTitle} from Advice Lab for practical insights for Australian financial advisers.`;

  const useSiteArticleStyles =
    !!post?.publishedRaw &&
    Date.parse(post.publishedRaw) >
      Date.parse("2026-09-28T23:59:59+10:00");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  console.log("Post data:", useSiteArticleStyles);

  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl bg-primary/20" />
          <div className="absolute bottom-0 right-[-10%] w-80 h-80 rounded-full blur-3xl bg-muted/40" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-10 pb-6">
            <Button
              variant="ghost"
              className="group relative overflow-hidden pl-0 pr-4 text-foreground hover:text-white"
              asChild
            >
              <Link to="/resources/blogs">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className=" relative inline-flex items-center gap-2 p-8 ">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </span>
              </Link>
            </Button>
          </div>
          <ScrollAnimation animation="fade-up">
            <Seo
              title={postTitle}
              description={postDescription}
              image={post?.thumbnail}
              pathname={`/blog/${slug || ""}`}
              article={Boolean(post)}
              keywords={post?.categories?.join(", ")}
              schemaData={
                post
                  ? {
                    "@type": "BlogPosting",
                    headline: postTitle,
                    description: postDescription,
                    image: post.thumbnail,
                    datePublished: post.published,
                    author: {
                      "@type": "Person",
                      name: post.author || "Advice Lab",
                    },
                    url: `https://advicelab.com.au/blog/${post.slug}`,
                  }
                  : undefined
              }
            />

            {loading ? (
              <div className="space-y-4 pb-16">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : error ? (
              <div className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8 text-center mb-16">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button asChild variant="secondary">
                  <Link to="/resources/blogs">Return to blog</Link>
                </Button>
              </div>
            ) : post ? (
              <article className="relative bg-background/80 backdrop-blur-sm rounded-3xl border border-border shadow-xl p-6 md:p-10 mb-16 overflow-hidden max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/10 pointer-events-none" />
                <div className="relative space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-tight">
                      {post.category}
                    </span>
                    {post.published && (
                      <span className="text-muted-foreground">
                        {post.published}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight text-primary">
                    {post.title}
                  </h1>

                  {!useSiteArticleStyles ? (
                    <div
                      className="prose prose-lg max-w-none
                      prose-headings:font-display prose-headings:text-heading-foreground prose-headings:font-bold
                      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-semibold
                      prose-p:text-base prose-p:leading-[1.85] prose-p:text-muted-foreground prose-p:my-4
                      prose-li:text-base prose-li:leading-normal prose-li:text-muted-foreground prose-li:my-0
                      prose-ul:my-5 prose-ul:space-y-0
                      prose-ol:my-5
                      [&_li>p]:my-0
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:shadow-md prose-img:mt-0 prose-img:mb-0
                      prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground prose-blockquote:italic
                      [&_.separator]:text-center [&_.separator]:mt-0 [&_.separator]:mb-0
                      [&_.separator-img]:w-full [&_.separator-img]:max-w-full [&_.separator-img]:h-auto [&_.separator-img]:block [&_.separator-img]:rounded-xl [&_.separator-img]:shadow-md
                      [&_img:not(.separator-img)]:w-full [&_img:not(.separator-img)]:max-w-full [&_img:not(.separator-img)]:h-auto
                      [&_p:empty]:hidden
                      [&_figure]:mt-0 [&_figure]:mb-0 [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground [&_figcaption]:text-center [&_figcaption]:mt-2"
                      dangerouslySetInnerHTML={{
                        __html: stripInlineTypography(post.contentHtml),
                      }}
                    />
                  ) : (
                    <div
                      className="blogger-content"
                      dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />
                  )}
                  {/* <div
                    className="prose prose-lg max-w-none
                      prose-headings:font-display prose-headings:text-heading-foreground prose-headings:font-bold
                      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-semibold
                      prose-p:text-base prose-p:leading-[1.85] prose-p:text-muted-foreground prose-p:my-4
                      prose-li:text-base prose-li:leading-normal prose-li:text-muted-foreground prose-li:my-0
                      prose-ul:my-5 prose-ul:space-y-0
                      prose-ol:my-5
                      [&_li>p]:my-0
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:shadow-md prose-img:my-8
                      prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground prose-blockquote:italic
                      [&_.separator]:text-center [&_.separator]:my-8
                      [&_.separator-img]:w-full [&_.separator-img]:max-w-full [&_.separator-img]:h-auto [&_.separator-img]:block [&_.separator-img]:rounded-xl [&_.separator-img]:shadow-md
                      [&_img:not(.separator-img)]:w-full [&_img:not(.separator-img)]:max-w-full [&_img:not(.separator-img)]:h-auto
                      [&_figure]:my-8 [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground [&_figcaption]:text-center [&_figcaption]:mt-2"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                  /> */}

                  {/* <div
                    className="blogger-content"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                  /> */}

                  <div className="pt-4">
                    <Button asChild variant="secondary">
                      <Link to="/resources/blogs">Back to blog</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ) : null}
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
