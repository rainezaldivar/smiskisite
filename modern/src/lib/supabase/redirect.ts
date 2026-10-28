export function safeNextPath(value: unknown, fallback = "/profile") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u001f]/.test(value)
  )
    return fallback;
  try {
    const parsed = new URL(value, "https://smiski.local");
    if (parsed.origin !== "https://smiski.local") return fallback;
    const pathname = decodeURIComponent(parsed.pathname).replace(/\/+$/, "");
    if (
      ["/login", "/register", "/logout", "/auth"].includes(pathname) ||
      pathname.startsWith("/auth/") ||
      pathname.startsWith("//") ||
      /[\\\u0000-\u001f]/.test(pathname)
    )
      return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
