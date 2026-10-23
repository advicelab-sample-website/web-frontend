import { useQuery } from "@tanstack/react-query";
import { fetchPostById, fetchPosts } from "@/store/useBlogPostStore";
import {
  BloggerPost,
  normalizeBloggerPost,
} from "./useBloggerPosts";

type BloggerPostDetail = BloggerPost & { contentHtml: string };

// comment updated

export const useBloggerPost = (slug: string | undefined) => {
  const { data, isLoading, error } = useQuery<BloggerPostDetail>({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      const posts = await fetchPosts();
      const matchingPost = posts.find(
        (post: any) => normalizeBloggerPost(post).slug === slug,
      );

      if (!matchingPost) {
        throw new Error("Post not found.");
      }

      const post = await fetchPostById(matchingPost.id);

      console.log("Fetched post:", post);
      return {
        ...normalizeBloggerPost(post),
        contentHtml: post.content || "",
      };
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 60,
  });

  return {
    post: data ?? null,
    loading: isLoading,
    error: error
      ? (error as Error).message || "Unable to load this post right now."
      : null,
  };
};

export type { BloggerPostDetail };
