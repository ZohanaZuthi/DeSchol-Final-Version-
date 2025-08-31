// models/university.model.js
import mongoose from "mongoose";

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  location: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  ranking: { type: Number, min: 1 },
  website: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  // models/university.model.js
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },



  // ✅ verification fields
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  acceptsInternationalStudents: { type: Boolean, default: true },
  intakePeriods: [String],
  applicationFee: Number,
  languageRequirements: {
    ielts: Number, gre: Number, otherLanguages: [String],
  },
  languagesOfInstruction: [String],
  createdAt: { type: Date, default: Date.now },
});

export const University = mongoose.model("University", universitySchema);
