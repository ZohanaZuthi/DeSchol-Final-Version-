// src/components/scholarships/ScholarshipCard.jsx
import { Link } from "react-router-dom";

export default function ScholarshipCard({ s }) {
  const id = s._id; // needed for /scholarships/:id
  const uniName =
    typeof s.university === "string" ? s.university : s.university?.name || "—";
  const deadlineText = s.deadline ? new Date(s.deadline).toLocaleDateString() : "—";
  const country = s.country ? String(s.country) : "—";
  const type = s.type || "General";

  return (
    <article className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3">
      {/* Make the title link to details */}
      {id ? (
        <Link
          to={`/scholarships/${id}`}
          className="text-lg font-semibold hover:underline underline-offset-2"
        >
          {s.title || "Untitled scholarship"}
        </Link>
      ) : (
        <h3 className="text-lg font-semibold">{s.title || "Untitled scholarship"}</h3>
      )}

      <div className="text-sm opacity-80">{uniName} • {country}</div>

      {s.description && (
        <p className="text-sm opacity-90 line-clamp-3">{String(s.description)}</p>
      )}

      <div className="text-xs text-neutral-500">
        {type} • Deadline: {deadlineText}
      </div>

      <div className="flex gap-3 pt-1">
        {/* View details (internal) */}
        {id && (
          <Link
            to={`/scholarships/${id}`}
            className="text-sm text-indigo-600 hover:underline"
          >
            View details
          </Link>
        )}

        {/* Apply (external) */}
        {s.link && (
          <a
            href={s.link}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-indigo-600 hover:underline"
          >
            Apply
          </a>
        )}
      </div>
    </article>
  );
}
