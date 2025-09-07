import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  requirement: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => /^https?:\/\/.+/.test(v),
      message: "Link must be a valid URL",
    },
  },
  deadline: {
    type: Date,
    required: false, 
  },
  type: {
    type: String,
    enum: ["Fully Funded", "Partial", "Grant", "General"],
    default: "General",
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University", 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Job=mongoose.model("Job",opportunitySchema);
