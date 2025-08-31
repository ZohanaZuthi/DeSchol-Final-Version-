// src/components/shared/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-sm font-medium transition ${
        isActive ? "bg-neutral-200 dark:bg-neutral-800"
                 : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
      }`
    }
  >
    {children}
  </NavLink>
)

export default function Navbar() {
  const auth = useAuth()
  const user = auth?.user
  const navigate = useNavigate()

  const onLogout = async () => {
    try { await auth?.logout?.() } finally { navigate("/", { replace: true }) }
  }

  const isRecruiterOrAdmin = user && (user.role === "recruiter" || user.role === "admin")

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-extrabold text-lg tracking-tight">
          De<span className="text-red-600 text-xl">S</span>chol<span className="text-red-600">.</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/scholarships">Scholarships</NavItem>
          <NavItem to="/news">News</NavItem>

          {user ? (
            <>
              <NavItem to="/dashboard">Dashboard</NavItem>

              {/* one smart entry for recruiters/admins */}
              {isRecruiterOrAdmin && <NavItem to="/compose">Compose</NavItem>}

             

              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Register</NavItem>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
