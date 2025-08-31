import { useEffect, useState } from "react"
import { api } from "../lib/api"
import { Link, useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const nav = useNavigate()

  const load = async () => {
    setError(""); setLoading(true)
    try {
      const res = await api.adminStats() // GET /api/admin/stats (auth)
      setData(res)
    } catch (e) {
      const msg = e?.message || "Failed to load admin stats"
      setError(msg)
      // gentle handling for restricted access
      if (/unauthorized|forbidden|401|403/i.test(msg)) {
        // send them to login; after login, come back here
        nav("/login", { replace: true, state: { from: { pathname: "/admin" } } })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="p-6">Loading admin dashboard…</div>

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={load}
          className="px-3 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:opacity-90"
        >
          Try again
        </button>
      </section>
    )
  }

  const { kpis, applicationsByStatus, recentUsers, recentApps } = data || {
    kpis: { userCount: 0, scholarshipCount: 0, appCount: 0 },
    applicationsByStatus: { submitted: 0, review: 0, accepted: 0, rejected: 0 },
    recentUsers: [], recentApps: []
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Compose button (restricted route) */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/compose"
            className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
          >
            + Compose Scholarship
          </Link>
          <button
            onClick={load}
            className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          ["Users", kpis.userCount],
          ["Scholarships", kpis.scholarshipCount],
          ["Applications", kpis.appCount],
        ].map(([label, val]) => (
          <div key={label} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="text-sm text-neutral-500">{label}</div>
            <div className="text-2xl font-semibold mt-1">{val}</div>
          </div>
        ))}
      </div>

      {/* Applications by status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          ["Submitted", applicationsByStatus.submitted],
          ["In Review", applicationsByStatus.review],
          ["Accepted", applicationsByStatus.accepted],
          ["Rejected", applicationsByStatus.rejected],
        ].map(([label, val]) => (
          <div key={label} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="text-sm text-neutral-500">{label}</div>
            <div className="text-2xl font-semibold mt-1">{val}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <h2 className="text-lg font-semibold mt-10 mb-3">Recent Users</h2>
      <ul className="space-y-2">
        {recentUsers.length ? recentUsers.map(u => (
          <li key={u._id} className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {u.fullname} — {u.email}
          </li>
        )) : <li className="text-sm opacity-80">No users yet.</li>}
      </ul>

      {/* Recent Applications */}
      <h2 className="text-lg font-semibold mt-10 mb-3">Recent Applications</h2>
      <ul className="space-y-2">
        {recentApps.length ? recentApps.map(a => (
          <li key={a._id} className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {a.applicant?.fullname || "—"} — {a.program || a.scholarship?.title || "—"} — {a.status}
          </li>
        )) : <li className="text-sm opacity-80">No applications yet.</li>}
      </ul>
    </section>
  )
}
