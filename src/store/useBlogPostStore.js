const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOG_ID;

const BASE_URL = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}`;

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error?.message || res.statusText;
    throw new Error(`Blogger API error (${res.status}): ${message}`);
  }
  return res.json();
}

function getApiUrl(path, params = {}) {
  if (!API_KEY || !BLOG_ID) {
    throw new Error("Blogger API is not configured.");
  }

  const searchParams = new URLSearchParams({
    key: API_KEY,
    ...params,
  });

  return `${BASE_URL}${path}?${searchParams.toString()}`;
}

export async function fetchPosts(maxResults = 50) {
  const url = getApiUrl("/posts", {
    fetchBodies: "true",
    maxResults: String(maxResults),
  });
  const data = await handle(await fetch(url));
  return data.items || [];
}


export async function fetchPostById(postId) {
  const url = getApiUrl(`/posts/${encodeURIComponent(postId)}`);
  return handle(await fetch(url));
}
