// controllers/application.controller.js
import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/news.model.js"; // your scholarships model is named Job

// POST /api/applications/apply  (auth)
export const applyScholarship = async (req, res) => {
  try {
    const { scholarship } = req.body;

    // basic validation on scholarship id
    if (!scholarship || !mongoose.Types.ObjectId.isValid(scholarship)) {
      return res.status(400).json({ message: "Invalid scholarship id" });
    }

    // prevent duplicate application for same user+scholarship
    const existing = await Application.findOne({
      user: req.id,
      scholarship
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const app = await Application.create({
      user: req.id,
      scholarship,
      status: "Submitted" // ensure a default if your schema supports it
    });

    // populate some basics for a nicer client response
    const populated = await app.populate([
      { path: "scholarship", populate: { path: "university" } }
    ]);

    return res.status(201).json({
      message: "Application submitted",
      application: populated
    });
  } catch (err) {
    console.error("APPLY ERROR:", err);
    return res.status(500).json({ message: "Failed to apply" });
  }
};

// GET /api/applications/my  (auth)
export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.id })
      .sort({ createdAt: -1 })
      .populate([
        { path: "scholarship", populate: { path: "university" } }
      ]);

    return res.json(applications);
  } catch (err) {
    console.error("GET MY APPS ERROR:", err);
    return res.status(500).json({ message: "Failed to load applications" });
  }
};

// GET /api/applications/my/dashboard  (auth)
export const myDashboard = async (req, res) => {
  try {
    // counts by status for the current user
    const byStatusAgg = await Application.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const byStatus = byStatusAgg.reduce((acc, it) => {
      acc[it._id] = it.count;
      return acc;
    }, {});

    // recent applications for table
    const recentApplications = await Application.find({ user: req.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate([{ path: "scholarship", populate: { path: "university" } }]);

    // latest scholarships to recommend (simple: newest 5)
    const latestScholarships = await Job.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("university");

    return res.json({
      byStatus: {
        submitted: byStatus["Submitted"] || 0,
        review: byStatus["In Review"] || 0,
        accepted: byStatus["Accepted"] || 0,
        rejected: byStatus["Rejected"] || 0
      },
      recentApplications,
      latestScholarships
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
};
