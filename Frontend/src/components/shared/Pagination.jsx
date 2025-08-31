export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  const items = []
  for (let p = 1; p <= pages; p++) {
    items.push(
      <button
        key={p}
        onClick={() => onChange(p)}
        className={`px-3 py-1 rounded-lg border text-sm ${
          p === page
            ? "bg-indigo-600 text-white border-indigo-600"
            : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }`}
      >
        {p}
      </button>
    )
  }
  return <div className="flex gap-2 flex-wrap">{items}</div>
}
