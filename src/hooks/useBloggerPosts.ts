import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/store/useBlogPostStore";
import { getDescription, getFirstImage, slugify } from "@/store/utils";

type BloggerPost = {
  id: string;
  postId: string;
  slug: string;
  title: string;
  url: string;
  published: string;
  publishedRaw?: string;
  excerpt: string;
  category: string;
  categories?: string[];
  author?: string;
  thumbnail?: string;
};

export const normalizeBloggerPost = (post: any): BloggerPost => ({
  id: post.id || post.postId,
  postId: post.id || post.postId,
  slug: slugify(post.title || ""),
  title: post.title || "Untitled post",
  url: post.url || "",
  published: post.published
    ? new Date(post.published).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "",
  publishedRaw: post.published,
  excerpt: getDescription(post.content || post.excerpt),
  category: post.labels?.[0] || "Blog",
  categories: post.labels || [],
  author: post.author?.displayName || "Advice Lab",
  thumbnail: getFirstImage(post.content),
});

export const useBloggerPosts = () => {
  const { data, isLoading, error } = useQuery<BloggerPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => (await fetchPosts()).map(normalizeBloggerPost),
    staleTime: 1000 * 60 * 60,
  });

  return {
    posts: data ?? [],
    loading: isLoading,
    error: error ? "Unable to load blog posts right now." : null,
  };
};

export type { BloggerPost };
