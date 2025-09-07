
export function displayUniversity(u) {
  if (!u) return "";
  if (typeof u === "string") return u;             
  if (typeof u === "object") return u.name || "";  
  return "";
}
