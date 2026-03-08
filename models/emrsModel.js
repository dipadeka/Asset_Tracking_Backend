const mongoose = require("mongoose");

// ── REUSABLE SUB-SCHEMAS ──

const wardenSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String
}, { _id: false });

const hostelSchema = new mongoose.Schema({
  capacity: Number,
  bedsAvailable: Number,
  currentOccupancy: Number,
  cctvInstalled: String,
  noOfCCTV: Number,
  securityAgency: String,
  waterStorage: String,      // ← new
  backupPower: String,       // ← new
  warden: wardenSchema
}, { _id: false });

const academicQualSchema = new mongoose.Schema({
  qualification: String,
  course: String,
  registrationNo: String,
  rollNo: String,
  college: String,
  marksObtained: String,
  university: String,
  passingYear: String
}, { _id: false });

const professionalQualSchema = new mongoose.Schema({
  qualification: String,
  registrationNo: String,
  rollNo: String,
  examConductedBy: String,
  passingYear: String,
  marksObtained: String,
  affiliationBody: String
}, { _id: false });

const dropoutSchema = new mongoose.Schema({
  rollNo: String,
  studentName: String,
  reason: String,
  guardianContactNo: String
}, { _id: false });

const migrationSchema = new mongoose.Schema({
  studentName: String,
  migratedFrom: String,
  transferredTo: String,
  reason: String
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  studentName: String,
  eventName: String,
  level: String,
  recognition: String
}, { _id: false });

// ── CLASS STRENGTH (with everything nested inside) ──
const classStrengthSchema = new mongoose.Schema({
  academicYear: String,
  class: String,
  section: String,
  sanctionedCapacity: Number,
  currentEnrollment: Number,
  category: String,
  academicPerformance: {
    appeared: Number,
    passed: Number,
    passPercent: String,
    above75: Number,
    below50: Number,
    stream: String,           // for class 11 & 12
    distinctions: Number,     // for class 10, 11, 12
    topScorer: String,        // for class 10, 11, 12
    topScore: Number          // for class 10, 11, 12
  },
  dropouts: [dropoutSchema],
  migrations: [migrationSchema],
  achievements: [achievementSchema]
}, { _id: false });

// ── EXTRA CURRICULAR ──
const extraCurricularSchema = new mongoose.Schema({
  academicYear: String,
  initiativeName: String,
  collaboratingPartner: String,
  areasOfDevelopment: [String],
  description: String,
  targetStudents: String,
  status: String
}, { _id: false });

// ── HOSPITALIZATION ──
const hospitalizationSchema = new mongoose.Schema({
  studentName: String,
  rollNo: String,
  class: String,
  section: String,
  admissionDate: String,
  dischargeDate: String,
  reasonForHospitalization: String,
  hospitalEmpanelled: String,
  empanellementValidity: String,
  treatmentDetails: String,
  doctorName: String,
  estimatedCost: Number,
  amountClaimed: Number,
  claimStatus: String,
  guardianName: String,
  guardianContact: String
}, { _id: false });

// ── TEACHING STAFF (qualifications nested inside each staff) ──
const teachingStaffSchema = new mongoose.Schema({
  post: String,
  name: String,
  dob: String,
  doj: String,
  email: String,
  contact: String,
  total: Number,
  filled: Number,
  vacant: Number,
  academicQualifications: [academicQualSchema],
  professionalQualifications: [professionalQualSchema],
  tetQualifications: [professionalQualSchema]
}, { _id: false });

// ── NON-TEACHING STAFF (no TET) ──
const nonTeachingStaffSchema = new mongoose.Schema({
  post: String,
  name: String,
  dob: String,
  doj: String,
  email: String,
  contact: String,
  total: Number,
  filled: Number,
  vacant: Number,
  academicQualifications: [academicQualSchema],
  professionalQualifications: [professionalQualSchema]
}, { _id: false });

// ── MAIN EMRS SCHEMA ──
const emrsSchema = new mongoose.Schema({

  // Basic Details (flat, not nested)
  EMRScode: Number,
  EMRSid: String,
  udaisecode: Number,
  schoolname: String,
  schooltype: String,
  affiliation: String,
  principalName: String,
  contactno: String,
  email: String,

  // Location (flat, pincode added)
  pincode: String,
  state: String,
  district: String,
  block: String,
  grampanchayat: String,

  // Infrastructure (flat)
  totalClassrooms: Number,
  classroomWithSmartClass: Number,
  classroomWithProjector: Number,
  scienceLab: String,
  computerLab: String,
  library: String,
  booksInLibrary: Number,
  playground: String,
  auditorium: String,
  medicalRoom: String,

  // Hostels (separate boys and girls)
  boysHostel: hostelSchema,
  girlsHostel: hostelSchema,

  // Student Data
  classStrength: [classStrengthSchema],
  extraCurricular: [extraCurricularSchema],
  hospitalization: [hospitalizationSchema],

  // Staff
  teachingStaff: [teachingStaffSchema],
  nonTeachingStaff: [nonTeachingStaffSchema],

  // Operational Cost
  operationalCost: {
    year: String,
    month: String,
    costType: String,
    amount: Number
  }

}, { timestamps: true });

module.exports = mongoose.model("EMRS", emrsSchema);