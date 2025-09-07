// Backend/controllers/user.controller.js
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";


const JWT_SECRET = process.env.SECRET_KEY || process.env.JWT_SECRET || "dev_secret";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const signToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });

const cookieOpts = {
  httpOnly: true,
  maxAge: ONE_DAY_MS,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

const toUserResponse = (u) => ({
  _id: u._id,
  fullname: u.fullname,
  email: u.email,
  phoneNumber: u.phoneNumber || "",
  role: u.role,
  isVerified: !!u.isVerified,
  bio: u.bio || "",
  skills: Array.isArray(u.skills) ? u.skills : [],
  profile: u.profile || {},
});

// email utils
function makeEmailToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // true for 465
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"DeSchol" <no-reply@deschol.local>',
    to,
    subject,
    html,
  });
}


export const registerUser = async (req, res) => {
  try {
    let { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
        success: false,
      });
    }

    email = String(email).toLowerCase().trim();
    role = (role || "student").toLowerCase();
    phoneNumber = phoneNumber || "";

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      isVerified: false,
    });

    
    const verifyToken = makeEmailToken();
    user.emailToken = verifyToken; 
    await user.save();

    
    const verifyUrl = `${FRONTEND_URL}/verify?token=${encodeURIComponent(verifyToken)}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
          <p>Hi ${user.fullname || ""},</p>
          <p>Click the link below to verify your email:</p>
          <p><a href="${verifyUrl}" target="_blank" rel="noreferrer">${verifyUrl}</a></p>
          <p>If you didn’t create an account, you can ignore this email.</p>
        `,
      });
    } catch (mailErr) {
      console.error("EMAIL SEND ERROR:", mailErr);
      
    }

    
    const authToken = signToken(user._id);
    res.cookie("token", authToken, cookieOpts);

    return res.status(201).json({
      message: "User registered. Check your email to verify.",
      success: true,
      token: authToken,
      user: toUserResponse(user),
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({ message: "Email already exists", success: false });
    }
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", success: false });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }

    const token = signToken(user._id);
    res.cookie("token", token, cookieOpts);

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const logout = async (_req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });
    return res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const me = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    return res.status(200).json({ success: true, user: toUserResponse(user) });
  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    if (!token) return res.status(400).json({ message: "Missing token", success: false });

    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token", success: false });
    }

    user.emailToken = undefined;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully", success: true });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return res.status(500).json({ message: "Verification failed", success: false });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, profile } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    if (fullname) user.fullname = fullname;
    if (email) user.email = String(email).toLowerCase().trim();
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (skills) user.skills = String(skills).split(",").map((s) => s.trim()).filter(Boolean);
    if (profile && typeof profile === "object") user.profile = { ...user.profile, ...profile };

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
