import { useEffect, useState } from "react"
import { api } from "../lib/api"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.studentDashboard() // GET /api/applications/my/dashboard
        setData(res)
      } catch (e) {
        setError(e.message || "Failed to load dashboard")
      } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <div className="p-6">Loading dashboard…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  const { byStatus, recentApplications, latestScholarships } = data

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Hello, {user?.fullname || "Student"} 👋</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          ["Submitted", byStatus.submitted],
          ["In Review", byStatus.review],
          ["Accepted", byStatus.accepted],
          ["Rejected", byStatus.rejected],
        ].map(([label, val]) => (
          <div key={label} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="text-sm text-neutral-500">{label}</div>
            <div className="text-2xl font-semibold mt-1">{val}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-3">Recent Applications</h2>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/40">
            <tr><th className="p-3 text-left">Scholarship</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Date</th></tr>
          </thead>
          <tbody>
            {recentApplications.map(a => (
              <tr key={a._id} className="border-t border-neutral-200/60 dark:border-neutral-800/60">
                <td className="p-3">{a.scholarship?.title || "—"}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3">{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!recentApplications.length && <tr><td className="p-3" colSpan={3}>No applications yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-3">New Scholarships</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {latestScholarships.map(s => (
          <div key={s._id} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-neutral-500">{s.university?.name} • {s.country}</div>
            <div className="mt-3">
              <Link className="text-indigo-600 text-sm" to={`/scholarships/${s._id}`}>View</Link>
            </div>
          </div>
        ))}
        {!latestScholarships.length && <div className="text-sm">No scholarships yet.</div>}
      </div>
    </section>
  )
}
