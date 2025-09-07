// Backend/controllers/scholarship.controller.js
import mongoose from "mongoose";
import { Job } from "../models/news.model.js";
import { University } from "../models/university.model.js";

const TYPE_MAP = new Map([
  ["fully funded", "Fully Funded"],
  ["full", "Fully Funded"],
  ["partial", "Partial"],
  ["grant", "Grant"],
  ["general", "General"],
]);

export const listScholarships = async (req, res) => {
  try {
    const { search = "", country = "", type = "", page = 1, limit = 12 } = req.query;

    const q = {};
    if (search) {
      const s = String(search).trim();
      q.$or = [{ title: new RegExp(s, "i") }, { description: new RegExp(s, "i") }, { requirement: new RegExp(s, "i") }];
    }
    if (country) q.country = String(country).toLowerCase().trim();
    if (type) q.type = TYPE_MAP.get(String(type).toLowerCase().trim()) || type;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10) || 12));

    const [items, total] = await Promise.all([
      Job.find(q).sort({ createdAt: -1 }).populate("university").skip((pageNum - 1) * pageSize).limit(pageSize),
      Job.countDocuments(q),
    ]);

    res.json({ items, page: pageNum, pages: Math.max(1, Math.ceil(total / pageSize)), total });
  } catch (err) {
    console.error("LIST SCHOLARSHIPS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch scholarships" });
  }
};

export const createScholarship = async (req, res) => {
  try {
    let { title, country, requirement, description, link, deadline, type, university } = req.body;
    if (!title || !country || !requirement || !description || !link || !university) {
      return res.status(400).json({ message: "Missing required fields (title, country, requirement, description, link, university)" });
    }

    const countryNorm = String(country).toLowerCase().trim();
    const typeNorm = TYPE_MAP.get(String(type || "").toLowerCase().trim()) || "General";

    let uniDoc = null;
    if (mongoose.Types.ObjectId.isValid(String(university))) {
      uniDoc = await University.findById(university).select("name verified");
      if (!uniDoc) return res.status(400).json({ message: "University not found" });
    } else {
      uniDoc = await University.findOne({ name: String(university).trim() }).select("_id name verified");
      if (!uniDoc) return res.status(400).json({ message: "University not found. Send a valid university id or exact name." });
      university = uniDoc._id;
    }

    
    const REQUIRE_VERIFIED_UNI = (process.env.REQUIRE_VERIFIED_UNI_FOR_COMPOSE ?? "true").toLowerCase() === "true";
    if (REQUIRE_VERIFIED_UNI && !uniDoc.verified) {
      return res.status(403).json({ message: `University "${uniDoc.name}" is not verified yet` });
    }

    const doc = await Job.create({
      title: String(title).trim(),
      country: countryNorm,
      requirement: String(requirement).trim(),
      description: String(description).trim(),
      link: String(link).trim(),
      deadline: deadline ? new Date(deadline) : undefined,
      type: typeNorm,
      university,
    });

    res.status(201).json({ message: "Scholarship created", scholarship: doc });
  } catch (e) {
    console.error("CREATE SCHOLARSHIP ERROR:", e);
    if (e?.name === "ValidationError") return res.status(400).json({ message: e.message });
    res.status(500).json({ message: "Failed to create scholarship" });
  }
};

export const getScholarshipById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("university");
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
