const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "")

function getToken() {
  try { return localStorage.getItem("deschol_token") || "" } catch { return "" }
}
function setToken(t) {
  try {
    if (t) localStorage.setItem("deschol_token", t)
    else   localStorage.removeItem("deschol_token")
  } catch {}
}

async function http(path, { query, auth = false, ...init } = {}) {
  const url = new URL(`${BASE}${path}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v)
    }
  }
  const headers = { "Content-Type": "application/json", ...(init.headers || {}) }
  const token = getToken()
  if (auth && token) headers["Authorization"] = `Bearer ${token}` 

  const res = await fetch(url, { ...init, headers, credentials: "include" })
  const ct = res.headers.get("content-type") || ""
  const body = ct.includes("application/json") ? await res.json() : await res.text()
  if (!res.ok) throw new Error(body?.message || body || `HTTP ${res.status}`)
  return body
}

export const api = {
  
  register: async (payload) => {
    const data = await http("/api/auth/register", { method: "POST", body: JSON.stringify(payload) })
    if (data?.token) setToken(data.token) 
    return data
  },
  login: async (payload) => {
    const data = await http("/api/auth/login", { method: "POST", body: JSON.stringify(payload) })
    if (data?.token) setToken(data.token)
    return data
  },
  me:  () => http("/api/auth/me", { auth: true }),
  logout: async () => {
    try { await http("/api/auth/logout", { method: "POST" }) }
    finally { setToken("") } 
  },

 
  createScholarship: (payload) =>
    http("/api/scholarships", { method: "POST", body: JSON.stringify(payload), auth: true }),
  listScholarships: (params) => http("/api/scholarships", { query: params }),
  getScholarship:   (id)     => http(`/api/scholarships/${id}`),


  listNews: (params) => http("/api/scholarships", { query: params }),


  studentDashboard: () => http("/api/applications/my/dashboard", { auth: true }),
  adminStats:       () => http("/api/admin/stats",               { auth: true }),

  
listUniversities: (params) => http("/api/universities", { query: params, auth: true }),

myUniversities:   () => http("/api/universities/me/mine", { auth: true }),

  createUniversity: (payload) =>
    http("/api/universities", { method: "POST", body: JSON.stringify(payload), auth: true }),
  verifyUniversity: (id) =>
    http(`/api/universities/${id}/verify`, { method: "PATCH", auth: true }),
}
