export function formatPrice(value: number | string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

export function imageUrl(value?: string | null): string {
  if (!value) return "/uploads/living.png";
  if (/^https:\/\//i.test(value)) return value;
  if (value.startsWith("/uploads/")) return value;
  if (value.startsWith("uploads/")) return `/${value}`;
  return `/uploads/${value.replace(/^\/+/, "")}`;
}
