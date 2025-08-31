// src/pages/auth/Login.jsx
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const [email, setEmail] = useState(localStorage.getItem("remember_email") || "")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(!!localStorage.getItem("remember_email"))
  const [showPass, setShowPass] = useState(false)
  const [caps, setCaps] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const emailErr = useMemo(() => {
    if (!email) return ""
    return EMAIL_RE.test(email.trim()) ? "" : "Enter a valid email"
  }, [email])

  const passErr = useMemo(() => {
    if (!password) return ""
    return password.length >= 6 ? "" : "Minimum 6 characters"
  }, [password])

  const formValid = !emailErr && !passErr && email && password

  useEffect(() => {
  
    document.title = "Log in • DeSchol"
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formValid) return
    setError("")
    setLoading(true)
    try {
      const data = await login(email.trim().toLowerCase(), password)
      if (remember) localStorage.setItem("remember_email", email.trim().toLowerCase())
      else localStorage.removeItem("remember_email")

      
      const dest = loc.state?.from?.pathname || "/dashboard"
      nav(dest, { replace: true })
    } catch (err) {
      
      const msg = err?.message || "Login failed"
      setError(msg.includes("Unauthorized") ? "Invalid email or password" : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold">Log in</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm">Email</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          {emailErr && <p className="text-xs mt-1 text-red-600">{emailErr}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm">Password</label>
          <div className="relative">
            <input
              className="mt-1 w-full px-3 py-2 pr-12 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              onKeyUp={(e)=>setCaps(e.getModifierState && e.getModifierState("CapsLock"))}
              autoComplete="current-password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={()=>setShowPass(s=>!s)}
              className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-500 hover:text-neutral-700"
              aria-label={showPass ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
          {passErr && <p className="text-xs mt-1 text-red-600">{passErr}</p>}
          {caps && <p className="text-xs mt-1 text-amber-600">Caps Lock is on</p>}
        </div>

        {/* Remember me + Forgot */}
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e)=>setRemember(e.target.checked)}
              className="accent-indigo-600"
            />
            Remember me
          </label>
          {/* Hook up when you build password reset */}
          <Link to="/forgot" className="text-sm text-indigo-600 hover:underline">Forgot password?</Link>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Submit */}
        <button
          disabled={loading || !formValid}
          className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <Link className="text-indigo-600 hover:underline" to="/register">Create one</Link>
      </p>
    </section>
  )
}
