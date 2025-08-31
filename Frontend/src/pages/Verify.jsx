// src/pages/Verify.jsx
import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"

export default function Verify() {
  const [sp] = useSearchParams()
  const [msg, setMsg] = useState("Verifying…")
  const token = sp.get("token")

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/verify?token=${encodeURIComponent(token)}`, { credentials: "include" })
        const data = await res.json()
        setMsg(data.message || (res.ok ? "Verified!" : "Verification failed"))
      } catch {
        setMsg("Verification failed")
      }
    })()
  }, [token])

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">Email Verification</h1>
      <p className="mb-6">{msg}</p>
      <Link className="text-indigo-600" to="/login">Go to login</Link>
    </section>
  )
}
