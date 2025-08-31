import { University } from "../models/university.model.js";

// Create a university
export const createUniversity = async (req, res) => {
  try {
    const { name, location, country, ranking, website, logoUrl, description } = req.body;

    if (!name || !location || !country || !website || !logoUrl || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payload = {
      name: name.trim(),
      location: location.trim(),
      country: country.trim(),
      ranking,
      website: website.trim(),
      logoUrl: logoUrl.trim(),
      description: description.trim(),
      createdBy: req.id,          // requires isAuthenticated middleware
      verified: true,            // never let client set this on create
      verifiedAt: undefined,
      verifiedBy: undefined,
    };

    const university = await University.create(payload);
    res.status(201).json({ message: "University created (pending verification)", university });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: "University name already exists" });
    }
    console.error("Create Error:", error);
    res.status(400).json({ message: error.message });
  }
};
export const myUniversities = async (req, res) => {
  try {
    const items = await University.find({ createdBy: req.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch your universities" });
  }
};


// Get all universities
export const getAllUniversities = async (req, res) => {
  try {
    const q = {};
    if (req.query.country) q.country = String(req.query.country).trim();
    if (req.query.search) {
      const s = String(req.query.search).trim();
      q.$or = [{ name: new RegExp(s, "i") }, { location: new RegExp(s, "i") }];
    }
    // default: only verified
    if (!("all" in req.query)) q.verified = true;

    const universities = await University.find(q).sort({ createdAt: -1 });
    res.json(universities);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch universities" });
  }
};


// Get university by ID
export const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }
    res.status(200).json(university);
  } catch (error) {
    res.status(400).json({ message: "Invalid University ID" });
  }
};

// Update university
export const updateUniversity = async (req, res) => {
  try {
    // strip verification fields from generic updates
    const { verified, verifiedAt, verifiedBy, createdBy, ...safeBody } = req.body;

    const updated = await University.findByIdAndUpdate(
      req.params.id,
      safeBody,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "University not found" });
    res.status(200).json({ message: "University updated", updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete university
export const deleteUniversity = async (req, res) => {
  try {
    const deleted = await University.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "University not found" });
    }
    res.status(200).json({ message: "University deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Verify a university
export const verifyUniversity = async (req, res) => {
  try {
    const updated = await University.findByIdAndUpdate(
      req.params.id,
      { $set: { verified: true, verifiedAt: new Date(), verifiedBy: req.id || undefined } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "University not found" });
    res.json({ message: "University verified", university: updated });
  } catch (error) {
    res.status(400).json({ message: "Invalid University ID" });
  }
};

// (optional) Unverify
export const unverifyUniversity = async (req, res) => {
  try {
    const updated = await University.findByIdAndUpdate(
      req.params.id,
      { $set: { verified: false }, $unset: { verifiedAt: 1, verifiedBy: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "University not found" });
    res.json({ message: "University unverified", university: updated });
  } catch (error) {
    res.status(400).json({ message: "Invalid University ID" });
  }
};




