import announcements from "@/data/news.json";

export function getNews() {
  return [...announcements].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}
