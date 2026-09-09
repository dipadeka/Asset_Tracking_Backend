const mongoose = require("mongoose");

// ── MONTHLY ATTENDANCE (both staff and enrollment) ──
const monthlyAttendanceSchema = new mongoose.Schema({
  month: String,
  workingDays: Number,
  totalStudents: Number,
  totalPresent: Number,
  present: Number,
  daysPresent: Number,
  daysAbsent: Number,
  percentage: Number,
  casualLeave: Number,
  earnedLeave: Number,
  medicalLeave: Number,
  maternityLeave: Number,
  paternityLeave: Number,
}, { _id: false, strict: false });

// ── WARDEN ──
const wardenSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String
}, { _id: false });

// ── HOSTEL ──
const hostelSchema = new mongoose.Schema({
  capacity: Number,
  bedsAvailable: Number,
  currentOccupancy: Number,
  cctvInstalled: String,
  noOfCCTV: Number,
  securityAgency: String,
  securityAgencyName: String,
  securityAgencyContact: String,
  warden: wardenSchema
}, { _id: false });

// ── MESS COMPLIANCE ──
const messComplianceSchema = new mongoose.Schema({
  weeklyMenuDisplayed: String,
  messInspectionRegister: String,
  foodStockRegister: String,
  foodComplaintRegister: String,
  messCleanlinessDaily: String
}, { _id: false });

// ── QUALIFICATIONS ──
const academicQualSchema = new mongoose.Schema({
  qualification: String,
  course: String,
  registrationNo: String,
  rollNo: String,
  college: String,
  marksObtained: String,
  university: String,
  passingYear: String,
  post: String,
  name: String,
  staffname: String,
}, { _id: false, strict: false });

const professionalQualSchema = new mongoose.Schema({
  qualification: String,
  registrationNo: String,
  rollNo: String,
  examConductedBy: String,
  passingYear: String,
  marksObtained: String,
  affiliationBody: String,
  post: String,
  name: String,
  staffname: String,
}, { _id: false, strict: false });

// ── DROPOUT ──
const dropoutSchema = new mongoose.Schema({
  rollNo: String,
  studentName: String,
  reason: String,
  guardianName: String,
  guardianContactNo: String,
  pinCode: String,
  district: String,
  postOffice: String,
  gramPanchayat: String,
  village: String
}, { _id: false });

// ── MIGRATION ──
const migrationSchema = new mongoose.Schema({
  studentName: String,
  migratedFrom: String,
  transferredTo: String,
  reason: String
}, { _id: false });

// ── ACHIEVEMENT ──
const achievementSchema = new mongoose.Schema({
  studentName: String,
  eventName: String,
  level: String,
  recognition: String
}, { _id: false });

// ── CATEGORY BREAKDOWN ──
const categoryBreakdownSchema = new mongoose.Schema({
  ST: String,
  PVTG: String,
  "DNT/NT/SNT": String,
  Orphan: String,
  LWE: String,
  Divyang: String
}, { _id: false });

// ── CLASS STRENGTH ──
const classStrengthSchema = new mongoose.Schema({
  academicYear: String,
  class: String,
  section: String,
  sanctionedCapacity: Number,
  currentEnrollment: Number,
  categoryBreakdown: categoryBreakdownSchema,     
  monthlyAttendance: [monthlyAttendanceSchema],   
  academicPerformance: {
    appeared: Number,
    passed: Number,
    passPercent: String,
    above75: Number,
    below50: Number,
    stream: String,
    distinctions: Number,
    topScorer: String,
    topScore: Number
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
  empanelmentDepartment: String,   
  treatmentDetails: String,
  doctorName: String,
  estimatedCost: Number,
  amountClaimed: Number,
  claimStatus: String,
  guardianName: String,
  guardianContact: String
}, { _id: false });

// ── TEACHING STAFF ──
const teachingStaffSchema = new mongoose.Schema({
  post: String,
  name: String,
  dob: String,
  doj: String,
  email: String,
  contact: String,
  contactNumber: String,
  total: Number,
  filled: Number,
  vacant: Number,
  academicQualifications: [academicQualSchema],
  professionalQualifications: [professionalQualSchema],
  tetQualifications: [professionalQualSchema],
  monthlyAttendance: [monthlyAttendanceSchema],
  staffName: String,
  staffType: String,
}, { _id: false, strict: false });

// ── NON-TEACHING STAFF ──
const nonTeachingStaffSchema = new mongoose.Schema({
  post: String,
  name: String,
  dob: String,
  doj: String,
  email: String,
  contact: String,
  contactNumber: String,
  total: Number,
  filled: Number,
  vacant: Number,
  academicQualifications: [academicQualSchema],
  professionalQualifications: [professionalQualSchema],
  monthlyAttendance: [monthlyAttendanceSchema],
  staffName: String,
  staffType: String,
}, { _id: false, strict: false });

// ── OPERATIONAL COST ROW ──          
const operationalCostSchema = new mongoose.Schema({
  year: String,
  month: String,
  costType: String,
  amount: Number
}, { _id: false });

// ── CONSTRUCTION COMPONENT ──
const constructionComponentSchema = new mongoose.Schema({
  component: String,
  units: String,
  status: String,
  progress: Number,
  startDate: String,
  endDate: String,
  assignedTo: String,
  budget: Number,
  remarks: String
}, { _id: false });

// ════════════════════════════════════════════
// ── MAIN EMRS SCHEMA ──
// ════════════════════════════════════════════
const emrsSchema = new mongoose.Schema({
 userId: {
    type: String,
    required: true,
  },
  clientSubmissionId: String,

  // ── BASIC DETAILS ──
  // payload keys: EMRScode, EMRSid, schoolCode, udaisecode, schoolname, schooltype,
  //               affiliation, principalName, contactno, email
  EMRScode: String,
  EMRSid: String,
  schoolCode: String,
  username: String,
  loginId: String,
  udaisecode: Number,
  schoolname: String,
  schooltype: String,
  affiliation: String,       // payload sends data.Affiliation mapped to affiliation
  principalName: String,     // payload sends data.NameofthePrincipal mapped to principalName
  contactno: String,
  email: String,             // payload sends data.emailid mapped to email

  // ── LOCATION ──
  // payload keys: pincode, state, district, block, grampanchayat
  pincode: String,
  state: String,
  district: String,
  block: String,
  grampanchayat: String,

  // ── INFRASTRUCTURE ──
  // payload keys match exactly
  totalClassrooms: Number,
  classroomWithSmartClass: Number,
  classroomWithProjector: Number,
  scienceLab: String,
  biologyLab: String,
  chemistryLab: String,
  physicsLab: String,
  computerLab: String,
  library: String,
  booksInLibrary: Number,
  playground: String,
  playgroundArea: Number,
  auditorium: String,          // payload: data.Auditorium → auditorium
  auditoriumCapacity: Number,  // payload: data.auditoriumCapacity
  medicalRoom: String,         // payload: data["Medical Room"] medicalRoom

  // ── HOSTELS ──
  boysHostel: hostelSchema,
  girlsHostel: hostelSchema,

  // ── MESS COMPLIANCE ──         payload: messCompliance object
  messCompliance: messComplianceSchema,

  // ── STUDENT DATA ──
  classStrength: [classStrengthSchema],
  extraCurricular: [extraCurricularSchema],
  hospitalization: [hospitalizationSchema],

  // ── STAFF ──
  teachingStaff: [teachingStaffSchema],
  nonTeachingStaff: [nonTeachingStaffSchema],

  // ── OPERATIONAL COST ──         
  operationalCost: [operationalCostSchema],

  // ── CONSTRUCTION STATUS ──
  constructionStatus: {
    projectStartDate: String,
    expectedEndDate: String,
    totalBudget: Number,
    school:    [constructionComponentSchema],
    residence: [constructionComponentSchema],
    outdoor:   [constructionComponentSchema],
    utilities: [constructionComponentSchema]
  }

}, { timestamps: true, strict: false });

module.exports = mongoose.model("EMRS", emrsSchema);