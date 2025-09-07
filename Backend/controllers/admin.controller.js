
import { User } from "../models/user.model.js";
import { Job } from "../models/news.model.js";
import { Application } from "../models/application.model.js";

export const adminStats = async (_req, res) => {
  const [userCount, scholarshipCount, appCount, recentUsers, recentApps, byStatus] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5),
    Application.find().sort({ createdAt: -1 }).limit(5).populate("scholarship"),
    Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
  ]);

  const statusMap = byStatus.reduce((a, s) => (a[s._id] = s.count, a), {});

  res.json({
    kpis: { userCount, scholarshipCount, appCount },
    applicationsByStatus: {
      submitted: statusMap["Submitted"] || 0,
      review: statusMap["In Review"] || 0,
      accepted: statusMap["Accepted"] || 0,
      rejected: statusMap["Rejected"] || 0
    },
    recentUsers,
    recentApps
  });
};
