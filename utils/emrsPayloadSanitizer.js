const toSafeNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toOptionalNumber = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const sanitizeConstructionComponents = (rows = []) =>
  rows.map((row) => ({
    ...row,
    progress: toSafeNumber(row.progress, 0),
    budget: toSafeNumber(row.budget, 0),
  }));

const normalizeAttendanceRows = (rows = []) =>
  (Array.isArray(rows) ? rows : []).map((row) => ({
    ...row,
    workingDays: toSafeNumber(row.workingDays, 0),
    totalStudents: toSafeNumber(row.totalStudents, 0),
    totalPresent: toSafeNumber(row.totalPresent, 0),
    present: toSafeNumber(row.present, 0),
    daysPresent: toSafeNumber(row.daysPresent, 0),
    daysAbsent: toSafeNumber(row.daysAbsent, 0),
    percentage: toSafeNumber(row.percentage, 0),
    casualLeave: toSafeNumber(row.casualLeave, 0),
    earnedLeave: toSafeNumber(row.earnedLeave, 0),
    medicalLeave: toSafeNumber(row.medicalLeave, 0),
    maternityLeave: toSafeNumber(row.maternityLeave, 0),
    paternityLeave: toSafeNumber(row.paternityLeave, 0),
  }));

const sanitizeEmrsPayload = (body = {}) => {
  const payload = { ...body };

  if (payload.schoolname == null && payload.schoolName) payload.schoolname = payload.schoolName;
  if (payload.affiliation == null && payload.Affiliation) payload.affiliation = payload.Affiliation;
  if (payload.principalName == null && payload.NameofthePrincipal) payload.principalName = payload.NameofthePrincipal;
  if (payload.email == null && payload.emailid) payload.email = payload.emailid;
  if (payload.grampanchayat == null && payload.gramPanchayat) payload.grampanchayat = payload.gramPanchayat;

  if ("udaisecode" in payload) {
    const udise = toOptionalNumber(payload.udaisecode);
    if (udise === null) {
      const err = new Error("udaisecode must be a valid number");
      err.statusCode = 400;
      throw err;
    }
    if (udise === undefined) delete payload.udaisecode;
    else payload.udaisecode = udise;
  }

  if (payload.constructionStatus) {
    const cs = { ...payload.constructionStatus };
    cs.totalBudget = toSafeNumber(cs.totalBudget, 0);
    ["school", "residence", "outdoor", "utilities"].forEach((key) => {
      if (Array.isArray(cs[key])) cs[key] = sanitizeConstructionComponents(cs[key]);
    });
    payload.constructionStatus = cs;
  }

  const numberFields = [
    "totalClassrooms",
    "classroomWithSmartClass",
    "classroomWithProjector",
    "booksInLibrary",
    "playgroundArea",
    "auditoriumCapacity",
  ];
  numberFields.forEach((field) => {
    if (field in payload) payload[field] = toSafeNumber(payload[field], 0);
  });

  ["boysHostel", "girlsHostel"].forEach((key) => {
    if (!payload[key]) return;
    payload[key] = {
      ...payload[key],
      capacity: toSafeNumber(payload[key].capacity, 0),
      bedsAvailable: toSafeNumber(payload[key].bedsAvailable, 0),
      currentOccupancy: toSafeNumber(payload[key].currentOccupancy, 0),
      noOfCCTV: toSafeNumber(payload[key].noOfCCTV, 0),
    };
  });

  if (Array.isArray(payload.operationalCost)) {
    payload.operationalCost = payload.operationalCost.map((row) => ({
      ...row,
      amount: toSafeNumber(row.amount, 0),
    }));
  }

  if (payload.gramPanchayat && !payload.grampanchayat) {
    payload.grampanchayat = payload.gramPanchayat;
    delete payload.gramPanchayat;
  }

  if (payload.waterHygieneSanitation) {
    payload.waterHygieneSanitation = {
      ...payload.waterHygieneSanitation,
    };
  }

  if (payload.teachingStaffAttendance) {
    payload.teachingStaffAttendance = normalizeAttendanceRows(payload.teachingStaffAttendance);
  }

  if (payload.nonTeachingStaffAttendance) {
    payload.nonTeachingStaffAttendance = normalizeAttendanceRows(payload.nonTeachingStaffAttendance);
  }

  if (payload.studentAttendance) {
    payload.studentAttendance = normalizeAttendanceRows(payload.studentAttendance);
  }

  if (Array.isArray(payload.teachingStaff)) {
    payload.teachingStaff = payload.teachingStaff.map((staff) => ({
      ...staff,
      total: toSafeNumber(staff.total, 0),
      filled: toSafeNumber(staff.filled, 0),
      vacant: toSafeNumber(staff.vacant, 0),
      contact: String(staff.contact ?? staff.contactNumber ?? "").trim(),
      contactNumber: String(staff.contactNumber ?? staff.contact ?? "").trim(),
    }));
  }

  if (Array.isArray(payload.nonTeachingStaff)) {
    payload.nonTeachingStaff = payload.nonTeachingStaff.map((staff) => ({
      ...staff,
      total: toSafeNumber(staff.total, 0),
      filled: toSafeNumber(staff.filled, 0),
      vacant: toSafeNumber(staff.vacant, 0),
      contact: String(staff.contact ?? staff.contactNumber ?? "").trim(),
      contactNumber: String(staff.contactNumber ?? staff.contact ?? "").trim(),
    }));
  }

  if (Array.isArray(payload.classStrength)) {
    payload.classStrength = payload.classStrength.map((row) => ({
      ...row,
      sanctionedCapacity: toSafeNumber(row.sanctionedCapacity, 0),
      currentEnrollment: toSafeNumber(row.currentEnrollment, 0),
      monthlyAttendance: normalizeAttendanceRows(row.monthlyAttendance),
    }));
  }

  return payload;
};

module.exports = { sanitizeEmrsPayload, toSafeNumber, toOptionalNumber };
