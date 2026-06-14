const mongoose = require("mongoose");

const emrsUserSchema = new mongoose.Schema(
  {
    schoolId: { type: Number },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["school", "admin"], required: true },
    name: { type: String, default: "" },
    schoolCode: { type: String, default: "" },
    schoolName: { type: String, default: "" },
    district: { type: String, default: "" },
    block: { type: String, default: "" },
    gramPanchayat: { type: String, default: "" },
    village: { type: String, default: "" },
    pincode: { type: String, default: "" },
    yearOfSanction: { type: String, default: "" },
    principal: { type: String, default: "" },
    contact: { type: String, default: "" },
    email: { type: String, default: "" },
    state: { type: String, default: "Assam" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("emrs_user", emrsUserSchema);
