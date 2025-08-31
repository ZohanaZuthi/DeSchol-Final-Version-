import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 opacity-80">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="mt-6 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">
        Go home
      </Link>
    </section>
  )
}
