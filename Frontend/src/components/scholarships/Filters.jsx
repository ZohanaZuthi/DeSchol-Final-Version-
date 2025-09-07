
export default function Filters({ values, onChange }) {
  const set = (k, v) => onChange({ ...values, [k]: v });

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      
      <select
        className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        value={values.type || ""}
        onChange={(e) => set("type", e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Fully Funded">Fully Funded</option>
        <option value="Partial">Partial</option>
        <option value="Grant">Grant</option>
        <option value="General">General</option>
      </select>

      
      <select
        className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        value={values.level || ""}
        onChange={(e) => set("level", e.target.value)}
      >
        <option value="">Any Level</option>
        <option value="undergraduate">Undergraduate</option>
        <option value="masters">Masters</option>
        <option value="phd">PhD</option>
      </select>

      <input
        className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        placeholder="Country / Region"
        value={values.country || ""}
        onChange={(e) => set("country", e.target.value)}
      />

      <button
        type="button"
        onClick={() => onChange({ type: "", level: "", country: "" })}
        className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        Reset
      </button>
    </div>
  );
}
