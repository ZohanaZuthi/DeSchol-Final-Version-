// Backend/dialogflow/webhook.js
import express from "express";
import { Job } from "../models/news.model.js";            // scholarships
import { University } from "../models/university.model.js";

const router = express.Router();

// (Optional) simple shared secret to block random calls
const DF_WEBHOOK_SECRET = process.env.DF_WEBHOOK_SECRET || "";

// util: build Dialogflow text response
function dfText(text) {
  return { fulfillmentMessages: [{ text: { text: [text] } }] };
}

router.post("/dialogflow", async (req, res) => {
  try {
    if (DF_WEBHOOK_SECRET) {
      const got = req.headers["x-dialogflow-secret"] || req.query.key;
      if (got !== DF_WEBHOOK_SECRET) return res.status(403).send("forbidden");
    }

    const body = req.body || {};
    const intent = body.queryResult?.intent?.displayName || "";
    const params = body.queryResult?.parameters || {};
    // If you set output contexts for paging, capture them here too:
    const contexts = body.queryResult?.outputContexts || [];

    // Route per intent
    switch (intent) {
      case "Scholarships.Search":
        return await handleScholarshipsSearch(params, res);

      case "Scholarships.More":
        // Optional: read next page token from context and return more.
        return await handleScholarshipsMore(contexts, res);

      case "Scholarships.Details":
        return await handleScholarshipDetails(params, res);

      case "Universities.Search":
        return await handleUniversitiesSearch(params, res);

      // Navigation-only intents can answer right here (no DB):
      case "Navigate.Scholarships":
        return res.json(dfText("Open the Scholarships page from the top menu."));
      case "Navigate.Compose":
        return res.json(dfText("Go to Compose → Scholarship (admin/recruiter only)."));
      case "Navigate.University":
        return res.json(dfText("Go to Compose → Register University."));
      case "Navigate.Dashboard":
        return res.json(dfText("Click Dashboard in the top menu."));
      case "Navigate.News":
        return res.json(dfText("Open the News page for recent updates."));

      default:
        return res.json(dfText("I didn’t get that. Try asking about scholarships or universities."));
    }
  } catch (e) {
    console.error("DF webhook error:", e);
    return res.json(dfText("Sorry, something went wrong while fetching data."));
  }
});

export default router;

/* ===== Handlers ===== */

async function handleScholarshipsSearch(params, res) {
  // Map Dialogflow params to your API filter
  // Configure entities in DF: sch_type (fully funded/partial/grant/general), country (@sys.geo-country), date (@sys.date)
  const filter = {};
  if (params?.country) filter.country = String(params.country).toLowerCase();
  if (params?.sch_type) {
    const t = String(params.sch_type).toLowerCase();
    const map = { "fully funded": "Fully Funded", "partial": "Partial", "grant": "Grant", "general": "General" };
    filter.type = map[t] || "General";
  }
  if (params?.date) filter.deadline = { $lt: new Date(params.date) };

  // Query Mongo (Job model)
  const items = await Job.find(filter).sort({ createdAt: -1 }).limit(5).populate("university");

  if (!items.length) return res.json(dfText("No scholarships matched. Try a different type or country."));

  const lines = items.map(j => {
    const uni = typeof j.university === "string" ? j.university : (j.university?.name || "—");
    const dln = j.deadline ? new Date(j.deadline).toLocaleDateString() : "—";
    return `• ${j.title} — ${uni} (${j.country?.toUpperCase() || "—"}) — Deadline: ${dln}`;
  });

  return res.json(dfText(`Here are some scholarships:\n${lines.join("\n")}\n\nSay “show more” for additional results.`));
}

async function handleScholarshipsMore(contexts, res) {
  // Simple variant: just return the next 5 most recent (or re-run last filter stored in context)
  const items = await Job.find({}).sort({ createdAt: -1 }).skip(5).limit(5).populate("university");
  if (!items.length) return res.json(dfText("No more results."));
  const lines = items.map(j => `• ${j.title} — ${j.university?.name || "—"}`);
  return res.json(dfText(lines.join("\n")));
}

async function handleScholarshipDetails(params, res) {
  const target = params?.target; // your @sys.any title/ID slot
  if (!target) return res.json(dfText("Which scholarship? Please say the title or ID."));

  // Try by exact ID first, then by title fragment
  let sch = null;
  try { sch = await Job.findById(target).populate("university"); } catch {}
  if (!sch) {
    sch = await Job.findOne({ title: new RegExp(String(target).trim(), "i") }).populate("university");
  }
  if (!sch) return res.json(dfText("I couldn’t find that scholarship."));

  const uni = typeof sch.university === "string" ? sch.university : (sch.university?.name || "—");
  const dln = sch.deadline ? new Date(sch.deadline).toLocaleDateString() : "—";
  const msg =
    `${sch.title}\n` +
    `University: ${uni}\n` +
    `Type: ${sch.type || "General"}\n` +
    `Country: ${sch.country?.toUpperCase() || "—"}\n` +
    `Deadline: ${dln}\n\n` +
    `${sch.requirement ? `Requirement: ${sch.requirement}\n\n` : ""}` +
    `${sch.description || ""}\n\n` +
    `${sch.link ? `Apply: ${sch.link}` : ""}`;

  return res.json(dfText(msg));
}

async function handleUniversitiesSearch(params, res) {
  const q = {};
  if (params?.country) q.country = String(params.country).trim();
  if (params?.uni_query) {
    const s = String(params.uni_query).trim();
    q.$or = [{ name: new RegExp(s, "i") }, { location: new RegExp(s, "i") }];
  }
  const items = await University.find(q).sort({ createdAt: -1 }).limit(5);
  if (!items.length) return res.json(dfText("No universities matched your query."));
  const lines = items.map(u => `• ${u.name} — ${u.country} — ${u.website}`);
  return res.json(dfText(lines.join("\n")));
}
