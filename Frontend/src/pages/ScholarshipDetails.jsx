// src/pages/ScholarshipDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";


function displayUniversity(u) {
  if (!u) return "";
  if (typeof u === "string") return u;
  return u.name || "";
}

export default function ScholarshipDetails() {
  const { id } = useParams();
  const [sch, setSch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await api.getScholarship(id);
        if (!stop) setSch(data);
      } catch (e) {
        if (!stop) setErr(e.message || "Failed to load scholarship");
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => { stop = true; };
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-8">Loading…</div>;
  if (err) return <div className="mx-auto max-w-3xl px-4 py-8 text-red-600">{err}</div>;
  if (!sch) return null;

  const uniName = displayUniversity(sch.university);

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">{sch.title}</h1>

      <div className="mt-1 text-sm text-neutral-500 flex flex-wrap gap-x-2">
        {uniName && <span>{uniName}</span>}
        {sch.country && <span>· {String(sch.country).toUpperCase()}</span>}
        {sch.type && <span>· {sch.type}</span>}
        {sch.deadline && <span>· {new Date(sch.deadline).toLocaleDateString()}</span>}
      </div>

      <div className="prose dark:prose-invert mt-6">
        {sch.requirement && (
          <p>
            <strong>Requirement:</strong> {sch.requirement}
          </p>
        )}
        {sch.description && <p>{String(sch.description)}</p>}
      </div>

      {sch.link && (
        <a
          href={sch.link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Official link
        </a>
      )}
    </section>
  );
}
