// src/pages/CreateUniversity.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function CreateUniversity() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    country: "",
    website: "",
    logoUrl: "",
    ranking: "",
    description: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.createUniversity(form);

      // ✅ Redirect to compose page no matter what
      if (res?.university?._id) {
        nav("/admin/compose", { replace: true });
      } else {
        // fallback if API only sends message
        nav("/admin/compose", { replace: true });
      }
    } catch (e) {
      // if error is duplicate key, still continue
      if (e.message.includes("already exists")) {
        nav("/admin/compose", { replace: true });
      } else {
        setErr(e.message || "Failed to register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Register University</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {["name", "location", "country", "website", "logoUrl", "ranking"].map(
          (k) => (
            <div key={k}>
              <label className="text-sm capitalize">{k}</label>
              <input
                name={k}
                value={form[k]}
                onChange={onChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border"
                required={["name", "location", "country", "website", "logoUrl"].includes(k)}
              />
            </div>
          )
        )}
        <div>
          <label className="text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="mt-1 w-full px-3 py-2 rounded-lg border"
            required
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Register & Continue"}
        </button>
      </form>
    </section>
  );
}
