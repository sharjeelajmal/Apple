export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const formatDate = (isoDate: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...options,
  }).format(new Date(isoDate));

export const resolveImageUrl = (url: string) => (url.startsWith("//") ? `https:${url}` : url);

export const formatMonthYear = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(date));

export const formatLongDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
