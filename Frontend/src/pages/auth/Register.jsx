import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")           
  const [role, setRole] = useState("student")      
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      await register({
        fullname: name.trim(),                      // NOTE: backend expects "fullname"
        email: email.trim().toLowerCase(),
        password,
        phoneNumber: phone.trim(),                  // NEW
        role                                        // NEW
      })
      nav("/", { replace: true })
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally { setLoading(false) }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Full name</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {/* NEW: phone number */}
        <div>
          <label className="text-sm">Phone number</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700"
            type="tel"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            required
          />
        </div>

        {/* NEW: role select */}
        <div>
          <label className="text-sm">Role</label>
          <select
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            required
          >
            <option value="student">Student</option>
            <option value="admin">Recruiter</option>
             <option value="counselor">Counselor</option>
           
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <Link className="text-indigo-600" to="/login">Log in</Link>
      </p>
    </section>
  )
}
