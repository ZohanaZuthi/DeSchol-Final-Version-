// src/pages/ComposeHub.jsx
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../lib/api"

export default function ComposeHub() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [mine, setMine] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        // Prefer an endpoint that returns **only my universities** if you have it:
        // const data = await api.myUniversities()
        // Fallback: get all and filter client-side by createdBy if present
        const data = await api.listUniversities()
        if (ignore) return
        setMine(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load universities")
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    if (loading || error) return
    if (!mine.length) {
      // nothing registered → go register first
      nav("/compose/university", { replace: true })
      return
    }
    const hasVerified = mine.some(u => u.verified)
    if (hasVerified) {
      // at least one verified → straight to compose scholarship
      nav("/admin/compose", { replace: true })
      return
    }
    // has universities but none verified → stay here and show wait screen
  }, [loading, error, mine, nav])

  if (loading) return <div className="p-6">Checking your university status…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  // pending verification screen
  return (
    <section className="mx-auto max-w-2xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Compose</h1>
      <p className="opacity-80">
        You’ve submitted a university but it hasn’t been verified yet. Once verified, you can compose scholarships.
      </p>

      <div className="space-y-3">
        {mine.map(u => (
          <div key={u._id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="font-medium">{u.name}</div>
            <div className="text-sm opacity-80">{u.country} · {u.location}</div>
            <div className="text-sm mt-1">
              Status: {u.verified ? "Verified ✅" : "Pending ⏳"}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link to="/compose/university" className="px-3 py-2 rounded-xl border">
          Register another university
        </Link>
        <Link to="/scholarships" className="px-3 py-2 rounded-xl border">
          Go back
        </Link>
      </div>
    </section>
  )
}
