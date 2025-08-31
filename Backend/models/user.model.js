import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
   role: {
  type: String,
role: { type: String, enum: ["student","admin","recruiter","counselor"], default: "student" },
  default: "student"
},

  
    profile: {
      image: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
      },
      bio: String,
  
      department: String,
      CG: Number,
      skills: [String],
      extracurricularActivities: String,
      resume: String,
      linkedin: String,
      github: String,
      portfolio: String,
  
      institution: String,
      position: String,
      institutionLocation: String,
    },
    emailToken: String,
isVerified: {
  type: Boolean,
  default: false
},
notifications: [
  {
    message: String,
    type: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }
],
  },{timestamps:true});


  export const User=mongoose.model("User",userSchema);


  