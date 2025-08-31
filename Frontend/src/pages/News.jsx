import { useEffect, useState } from "react"
import { api } from "../lib/api"
import SearchInput from "../components/shared/SearchInput"
import Pagination from "../components/shared/Pagination"
import Skeleton from "../components/shared/Skeleton"

function NewsCard({ n }) {
  return (
    <article className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-2">
      <h3 className="text-lg font-semibold">{n.title}</h3>
      <p className="text-sm opacity-90">{n.summary}</p>
      <div className="text-xs text-neutral-500">
        {n.source} • {n.publishedAt && new Date(n.publishedAt).toLocaleDateString()}
      </div>
      {n.url && (
        <a
          href={n.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-2 text-sm text-indigo-600 hover:underline"
        >
          Read more
        </a>
      )}
    </article>
  )
}

export default function News() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    api
      .listNews({ search, page, limit: 10 })
      .then((data) => {
        if (ignore) return
        setItems(data.items || data.news || [])
        setPages(data.pages || data.totalPages || 1)
      })
      .catch(console.error)
      .finally(() => !ignore && setLoading(false))
    return () => (ignore = true)
  }, [search, page])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">News & Updates</h2>
        <SearchInput value={search} onChange={setSearch} placeholder="Search news…" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : items.length ? (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((n) => (
              <NewsCard key={n._id || n.id} n={n} />
            ))}
          </div>
          <div className="pt-6">
            <Pagination page={page} pages={pages} onChange={setPage} />
          </div>
        </>
      ) : (
        <p className="opacity-80">No news found.</p>
      )}
    </section>
  )
}
