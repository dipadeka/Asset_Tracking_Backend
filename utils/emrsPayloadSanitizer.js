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

const sanitizeEmrsPayload = (body = {}) => {
  const payload = { ...body };

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

  return payload;
};

module.exports = { sanitizeEmrsPayload, toSafeNumber, toOptionalNumber };
