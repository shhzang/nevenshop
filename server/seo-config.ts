/** Public canonical domain used by server-rendered metadata and sitemaps. */
export const PRIMARY_SITE_URL = (process.env.PUBLIC_SITE_URL || "https://neven.bar").replace(/\/$/, "");

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
