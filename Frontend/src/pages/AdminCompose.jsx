// src/pages/AdminCompose.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function AdminCompose() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    country: "",
    type: "",
    requirement: "",
    description: "",
    link: "",
    deadline: "",
    university: "",
  });

  const [universities, setUniversities] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // Load ALL universities (verified + unverified)
  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const data = await api.listUniversities({ all: 1 }); // <- changed: include unverified too
        if (!stop) setUniversities(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!stop) setErr(e.message || "Failed to load universities");
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const payload = { ...form, deadline: form.deadline || undefined };
      const res = await api.createScholarship(payload);
      if (res?.scholarship?._id) {
        setMsg("Scholarship created!");
        nav(`/scholarships/${res.scholarship._id}`, { replace: true });
      } else {
        setMsg("Created (no id returned)");
      }
    } catch (e) {
      setErr(typeof e?.message === "string" ? e.message : "Failed to create scholarship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Compose Scholarship</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Title" name="title" value={form.title} onChange={onChange} required />
        <Field label="Country" name="country" value={form.country} onChange={onChange} required />
        <Field label="Type" name="type" value={form.type} onChange={onChange} placeholder="Fully Funded / Partial / Grant / General" />
        <Field label="Requirement" name="requirement" value={form.requirement} onChange={onChange} />
        <Text  label="Description" name="description" value={form.description} onChange={onChange} required />
        <Field label="Link" name="link" value={form.link} onChange={onChange} placeholder="https://…" />
        <Field label="Deadline" type="date" name="deadline" value={form.deadline} onChange={onChange} />

        {/* University select — label is name, value is _id */}
        <div>
          <label className="text-sm">University</label>
          <select
            name="university"
            value={form.university}
            onChange={onChange}
            required
            className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
          >
            <option value="">Select a university…</option>
            {universities.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          <p className="text-xs opacity-70 mt-1">Showing all registered universities.</p>
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}

        <button
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-60"
        >
          {loading ? "Publishing…" : "Publish"}
        </button>
      </form>
    </section>
  );
}

function Field({ label, ...rest }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        {...rest}
        className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
      />
    </div>
  );
}

function Text({ label, ...rest }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <textarea
        {...rest}
        rows={5}
        className="mt-1 w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
      />
    </div>
  );
}
