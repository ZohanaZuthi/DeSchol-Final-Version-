import { useEffect, useState } from "react"
import { api } from "../lib/api"
import SearchInput from "../components/shared/SearchInput"
import Filters from "../components/scholarships/Filters"
import ScholarshipCard from "../components/scholarships/ScholarshipCard"
import Pagination from "../components/shared/Pagination"
import Skeleton from "../components/shared/Skeleton"

export default function Scholarships() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({ type: "", level: "", country: "" })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    api
      .listScholarships({ search, type: filters.type, level: filters.level, country: filters.country, page, limit: 9 })
      .then((data) => {
        if (ignore) return
        setItems(data.items || data.scholarships || [])
        setPages(data.pages || data.totalPages || 1)
      })
      .catch((e) => console.error(e))
      .finally(() => !ignore && setLoading(false))
    return () => (ignore = true)
  }, [search, filters, page])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Scholarships</h2>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by title, provider..." />
      </div>

      <Filters values={filters} onChange={(v) => { setFilters(v); setPage(1); }} />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : items.length ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((s) => (
              <ScholarshipCard key={s._id} s={s} />
            ))}
          </div>
          <div className="pt-6">
            <Pagination page={page} pages={pages} onChange={setPage} />
          </div>
        </>
      ) : (
        <p className="opacity-80">No scholarships found. Try different filters.</p>
      )}
    </section>
  )
}
