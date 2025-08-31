// src/lib/formatters.js (or inline in each component)
export function displayUniversity(u) {
  if (!u) return "";
  if (typeof u === "string") return u;             // backend returned an id or name string
  if (typeof u === "object") return u.name || "";  // populated doc
  return "";
}
